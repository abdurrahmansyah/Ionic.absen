import { Component, OnInit } from '@angular/core';
import { GlobalService, ReportData } from 'src/app/services/global.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form-absen-proyek',
  templateUrl: './form-absen-proyek.component.html',
  styleUrls: ['./form-absen-proyek.component.scss'],
})
export class FormAbsenProyekComponent implements OnInit {
  public txtTimeRequest: string;
  public txtTemperature: string;
  public lokasi: string;
  public kendaraan: string;
  public isInteraksi: boolean = true;
  public isRiwayatSakit: boolean = true;
  public isOutPlan: boolean = true;
  public isExternal: boolean = true;
  public isFamilyMemberSick: boolean = true;
  public isFamilyMemberSick2: boolean = false;
  public isFamilyMemberSick3: boolean = false;
  public txtHubungan: any;
  public txtUsia: any;
  public txtSickDesc: any;
  public txtHubungan2: any;
  public txtUsia2: any;
  public txtSickDesc2: any;
  public txtHubungan3: any;
  public txtUsia3: any;
  public txtSickDesc3: any;
  public waktuOlahraga: any;
  public jenisOlahraga: any;
  public loading: any;

  constructor(private camera: Camera,
    private alertController: AlertController,
    private globalService: GlobalService,
    private loadingController: LoadingController,
    private datePipe: DatePipe,
    public router: Router) {
    this.InitializeLoadingCtrl();
    this.lokasi = "1";
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  ngOnInit() {
    this.txtTimeRequest = this.globalService.timeRequest;
  }

  public IsFamilyMemberSick() {
    this.isFamilyMemberSick2 = false;
    this.isFamilyMemberSick3 = false;
  }

  public AddFamilyMemberSick2() {
    this.isFamilyMemberSick2 = true;
  }

  public AddFamilyMemberSick3() {
    this.isFamilyMemberSick3 = true;
  }

  public SaveWfoNewNormalRequest() {
    try {
      this.ValidateData();
      this.SaveRequestData();
    } catch (e) {
      this.alertController.create({
        mode: 'ios',
        message: e.message,
        buttons: ['OK']
      }).then(alert => {
        return alert.present();
      });
    }
  }

  private ValidateData() {
    if (!this.lokasi) {
      throw new Error("Lokasi kerja wajib diisi.");
    }

    if (!this.txtTemperature) {
      throw new Error("Suhu badan wajib diisi.");
    }

    if (this.txtTemperature < "34" || this.txtTemperature > "39") {
      throw new Error("Silahkan mengisi suhu tubuh normal (34-39 Celcius).");
    }

    if (!this.kendaraan) {
      throw new Error("Kendaraan ke area kerja wajib diisi.");
    }

    if (this.isFamilyMemberSick) {
      if (!this.txtHubungan)
        throw new Error("Hubungan dengan karyawan wajib diisi.");
      if (!this.txtUsia)
        throw new Error("Usia wajib diisi.");
      if (!this.txtSickDesc)
        throw new Error("Deskripsi kondisi wajib diisi.");
    }

    if (this.isFamilyMemberSick2) {
      if (!this.txtHubungan2)
        throw new Error("Hubungan dengan karyawan wajib diisi.");
      if (!this.txtUsia2)
        throw new Error("Usia wajib diisi.");
      if (!this.txtSickDesc2)
        throw new Error("Deskripsi kondisi wajib diisi.");
    }

    if (this.isFamilyMemberSick3) {
      if (!this.txtHubungan3)
        throw new Error("Hubungan dengan karyawan wajib diisi.");
      if (!this.txtUsia3)
        throw new Error("Usia wajib diisi.");
      if (!this.txtSickDesc3)
        throw new Error("Deskripsi kondisi wajib diisi.");
    }

    if (!this.waktuOlahraga) {
      throw new Error("Jadwal olahraga wajib diisi.");
    }

    if (!this.jenisOlahraga) {
      throw new Error("Jenis olahraga wajib diisi.");
    }
  }

  public SaveRequestData() {
    this.PresentLoading();
    this.byPassSaveReportData();
  }

  byPassSaveReportData() {
    var reportData = new ReportData();
    reportData.szUserId = this.globalService.userData.szToken;
    reportData.dateAbsen = this.globalService.dateRequest;
    reportData.timeAbsen = this.globalService.timeRequest;
    reportData.kota = this.lokasi == "0" ? "Kota Jakarta Timur" : this.globalService.kota;
    reportData.provinsi = this.lokasi == "0" ? "Daerah Khusus Ibukota Jakarta" : this.globalService.provinsi;
    reportData.work_from = this.lokasi == "0" ? "WFO" : "WFO - Proyek";
    reportData.szActivityId = this.globalService.activityDataList.wfoProyek.id;
    reportData.szDesc = "WFO - Absen Proyek";
    reportData.health_check = "";
    reportData.suhu = this.txtTemperature;
    reportData.szLocation = this.lokasi == "0" ? "HK Tower" : this.globalService.location;
    reportData.interaksi = this.isInteraksi ? "Ada" : "Tidak ada";
    reportData.riwayat_sakit = this.isRiwayatSakit ? "Pernah" : "Tidak pernah";
    reportData.kendaraan = this.kendaraan;
    reportData.rencana_keluar = this.isOutPlan ? "Ada" : "Tidak ada";
    reportData.external = this.isExternal ? "Ada" : "Tidak ada";
    reportData.kondisi_keluarga = this.isFamilyMemberSick ? "Ada" : "Tidak ada";
    reportData.hub_keluarga = this.isFamilyMemberSick3 ? this.txtHubungan + " ; " + this.txtHubungan2 + " ; " + this.txtHubungan3 : this.isFamilyMemberSick2 ? this.txtHubungan + " ; " + this.txtHubungan2 : this.isFamilyMemberSick ? this.txtHubungan : "";
    reportData.umur_keluarga = this.isFamilyMemberSick3 ? this.txtUsia + " ; " + this.txtUsia2 + " ; " + this.txtUsia3 : this.isFamilyMemberSick2 ? this.txtUsia + " ; " + this.txtUsia2 : this.isFamilyMemberSick ? this.txtUsia : "";
    reportData.desc_kondisi = this.isFamilyMemberSick3 ? this.txtSickDesc + " ; " + this.txtSickDesc2 + " ; " + this.txtSickDesc3 : this.isFamilyMemberSick2 ? this.txtSickDesc + " ; " + this.txtSickDesc2 : this.isFamilyMemberSick ? this.txtSickDesc : "";
    reportData.waktu_olahraga = this.datePipe.transform(this.waktuOlahraga, 'yyyy-MM-dd');
    reportData.jenis_olahraga = this.jenisOlahraga;
    reportData.isRequest = "1";

    var data = this.globalService.SaveReportDataWithRequest(reportData);
    this.SubscribeGetReportDatas(data);
  }

  private async SubscribeGetReportDatas(data: Observable<any>) {
    data.subscribe(data => {
      if (data.response == "success") {
        this.loadingController.dismiss();
        this.router.navigate(['home']);

        this.PresentNotif(true);
        // this.globalService.StartLocalNotification();
      }
      else {
        this.loadingController.dismiss();
        this.globalService.PresentToast("Gagal melakukan absensi");
      }
    });
  }

  private async PresentNotif(isArrived: boolean) {
    await this.alertController.create({
      mode: 'ios',
      message: 'This is an alert message.',
      cssClass: isArrived ? 'alert-ontime' : 'alert-pulang',
      buttons: [{
        text: 'OK',
        role: 'Cancel'
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  async PresentLoading() {
    await this.loading.present();
  }
}