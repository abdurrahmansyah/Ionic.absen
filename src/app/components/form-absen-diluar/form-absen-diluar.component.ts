import { Component, OnInit } from '@angular/core';
import { ActivityId, StatusId, GlobalService, RequestData, ReportData } from 'src/app/services/global.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-absen-diluar',
  templateUrl: './form-absen-diluar.component.html',
  styleUrls: ['./form-absen-diluar.component.scss'],
})
export class FormAbsenDiluarComponent implements OnInit {
  public txtTimeRequest: string;
  public txtDesc: string;
  public photo: any = [];
  public kesehatan: any;
  public isInteraksi: boolean = true;
  public isRiwayatSakit: boolean = true;
  public isOutPlan: boolean = true;
  public isExternal: boolean = true;
  public isFamilyMemberSick: boolean = true;
  public isFamilyMemberSick2: boolean = false;
  public isFamilyMemberSick3: boolean = false;
  public isArrived: any;
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
  private dataimage: string;
  private loading: any;

  constructor(private camera: Camera,
    private alertController: AlertController,
    private globalService: GlobalService,
    private loadingController: LoadingController,
    public router: Router) {
    this.InitializeLoadingCtrl();
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  ngOnInit() {
    this.txtTimeRequest = this.globalService.timeRequest;
    this.isArrived = this.globalService.isArrived;
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

  public SaveOutsideRequest() {
    try {
      this.ValidateData();

      if (this.globalService.isArrived) {
        this.SaveRequestData(this.globalService.activityDataList.datangDiluarKantor.id);
      }
      else {
        this.SaveRequestData(this.globalService.activityDataList.pulangDiluarKantor.id);
      }
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
    if (!this.txtDesc) {
      throw new Error("Alasan wajib diisi.");
    }

    if (!this.dataimage) {
      throw new Error("Foto wajib diisi.");
    }

    if (this.isArrived) {
      if (!this.kesehatan) {
        throw new Error("Kondisi kesehatan wajib diisi.");
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
  }

  private SaveRequestData(szActivityId: string) {
    this.PresentLoading();
    this.byPassSaveReportData();

    // var requestData = new RequestData();
    // requestData.szUserId = this.globalService.userData.szToken;
    // requestData.dateRequest = this.globalService.dateRequest;
    // requestData.timeRequest = this.globalService.timeRequest;
    // requestData.szActivityId = szActivityId;
    // requestData.szDesc = this.txtDesc;
    // requestData.szLocation = this.globalService.geoLatitude + ", " + this.globalService.geoLongitude;
    // // requestData.szStatusId = StatusId.ST003;
    // requestData.decTotal = "";
    // requestData.szReasonImage = this.dataimage;
    // // requestData.bActiveRequest = true;
    // this.globalService.SaveRequestData(requestData);
  }

  byPassSaveReportData() {
    var reportData = new ReportData();
    reportData.szUserId = this.globalService.userData.szToken;
    reportData.dateAbsen = this.globalService.dateRequest;
    reportData.timeAbsen = this.globalService.timeRequest;
    reportData.szLocation = this.globalService.location;
    reportData.kota = this.globalService.kota;
    reportData.provinsi = this.globalService.provinsi;
    reportData.work_from = "WFH";
    reportData.szActivityId = this.globalService.diluarKantor;
    reportData.szImage = this.dataimage;
    reportData.szDesc = this.txtDesc;

    if (this.isArrived) {
      reportData.health_check = this.kesehatan;
      reportData.suhu = "";
      reportData.interaksi = this.isInteraksi ? "Ada" : "Tidak ada";
      reportData.riwayat_sakit = this.isRiwayatSakit ? "Pernah" : "Tidak pernah";
      reportData.kendaraan = "";
      reportData.rencana_keluar = this.isOutPlan ? "Ada" : "Tidak ada";
      reportData.external = this.isExternal ? "Ada" : "Tidak ada";
      reportData.kondisi_keluarga = this.isFamilyMemberSick ? "Ada" : "Tidak ada";
      reportData.hub_keluarga = this.isFamilyMemberSick3 ? this.txtHubungan + " ; " + this.txtHubungan2 + " ; " + this.txtHubungan3 : this.isFamilyMemberSick2 ? this.txtHubungan + " ; " + this.txtHubungan2 : this.isFamilyMemberSick ? this.txtHubungan : "";
      reportData.umur_keluarga = this.isFamilyMemberSick3 ? this.txtUsia + " ; " + this.txtUsia2 + " ; " + this.txtUsia3 : this.isFamilyMemberSick2 ? this.txtUsia + " ; " + this.txtUsia2 : this.isFamilyMemberSick ? this.txtUsia : "";
      reportData.desc_kondisi = this.isFamilyMemberSick3 ? this.txtSickDesc + " ; " + this.txtSickDesc2 + " ; " + this.txtSickDesc3 : this.isFamilyMemberSick2 ? this.txtSickDesc + " ; " + this.txtSickDesc2 : this.isFamilyMemberSick ? this.txtSickDesc : "";
      reportData.waktu_olahraga = this.waktuOlahraga;
      reportData.jenis_olahraga = this.jenisOlahraga;
    }
    reportData.isRequest = "1";

    var data = this.globalService.SaveReportDataWithRequest(reportData);
    this.SubscribeGetReportDatas(data);
  }

  private async SubscribeGetReportDatas(data: Observable<any>) {
    data.subscribe(data => {
      if (data.response == "success") {
        this.loadingController.dismiss();
        this.router.navigate(['home']);

        if (this.globalService.diluarKantor == this.globalService.activityDataList.datangDiluarKantor.id)
          this.PresentNotif(true);
        else
          this.PresentNotif(false);
        // this.globalService.PresentToast("Berhasil melakukan absensi");

        if (this.isArrived)
          this.globalService.StartLocalNotification();
        else
          this.globalService.CancelLocalNotification();
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

  public TakePhotos() {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      allowEdit: true,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
      this.dataimage = imageData;
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

  async PresentLoading() {
    await this.loading.present();
  }
}
