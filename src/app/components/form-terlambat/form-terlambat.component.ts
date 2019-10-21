import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityId, StatusId, GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-terlambat',
  templateUrl: './form-terlambat.component.html',
  styleUrls: ['./form-terlambat.component.scss'],
})
export class FormTerlambatComponent implements OnInit {
  public txtTimeNow: string;
  public txtDesc: string;
  szUserId: string;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public http: HttpClient,
    private storage: Storage,
    private globalService: GlobalService,
    public toastController: ToastController,
  ) {
    this.GetStorage();
    this.Timer();
  }

  ngOnInit() {
    var dateData = this.globalService.GetDate();
    this.txtTimeNow = this.CheckTime(dateData.decHour) + ":" + this.CheckTime(dateData.decMinute) + ":" + this.CheckTime(dateData.decSec) + " " + dateData.szAMPM;
  }

  private CheckTime(i: any) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  private Timer() {
    setInterval(function () {
      this.ngOnInit();
    }.bind(this), 500);
  }

  async GetStorage() {
    //Fungsi untuk mengambil value pada local storage
    await this.storage.get('szUserId').then((szUserId) => {
      this.szUserId = szUserId;
    });
  }

  SaveLateRequest() {
    var dateData = this.globalService.GetDate();
    var date = dateData.decYear + "/" + dateData.decMonth + "/" + dateData.decDate;

    // var url = 'http://sihk.hutamakarya.com/apiabsen/formrequest.php';
    var url = 'http://sihk.hutamakarya.com/apiabsen/SaveRequestData.php';
    var szRequestId = "HK_" + date + "_" + ActivityId.AC002 + "_" + this.szUserId;
    var dtmRequest = dateData.date.toLocaleString();

    let postdata = new FormData();
    postdata.append('szRequestId', szRequestId);
    postdata.append('szUserId', this.szUserId);
    postdata.append('dateRequest', dtmRequest);
    postdata.append('szActivityId', ActivityId.AC002);
    postdata.append('szDesc', this.txtDesc);
    postdata.append('szLocation', "");
    postdata.append('szStatusId', StatusId.ST003);
    postdata.append('decTotal', "0"); // NANTI FIELD DECTOTAL DIHAPUS KEKNYA // KALO GA YA DIBIKIN ITUNGANNYA
    postdata.append('dtmCreated', dtmRequest);
    postdata.append('dtmLastUpdated', dtmRequest);

    var data: Observable<any> = this.http.post(url, postdata);
    data.subscribe(hasil => { });
    this.PresentToast("Berhasil mengajukan izin terlambat");
    this.router.navigate(['home']);
  }

  async PresentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }
}