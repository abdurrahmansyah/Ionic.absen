//import { Component } from '@angular/core';
//import { NavController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { AuthenticationService } from './../services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { GlobalService, ActivityId } from '../services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  timeDatas: any = [];
  geoLatitude: number;
  geoLongitude: number;
  lat: number;
  long: number;
  waktu: string;
  public txtTimeNow: string;
  public txtDayNow: string;
  public inputVal: string = "variabel";
  public txtTimeArrived: string;
  public timeArived: string;
  public txtDate: string;
  public txtTimeBack: string = "";
  public txtWorkStatus: string = "";
  geoAccuracy: number;
  szUserId: any;
  kehadiran: any;
  colorStatus: string;
  public buttonPropertyDatas = [];
  error: void;
  timeBack: string;
  options: GeolocationOptions;
  currentPos: Geoposition;
  popoverParam: any;

  constructor(public navCtrl: NavController, public alertController: AlertController,
    public router: Router,
    public geolocation: Geolocation,
    public http: HttpClient,
    private storage: Storage,
    public popoverController: PopoverController,
    private authService: AuthenticationService,
    private globalService: GlobalService
  ) {
    this.ShowFirstLoadData();
    this.Timer();
  }

  async ShowFirstLoadData() {
    await this.GetUserId();
    this.GetTimeWorkingAndStatusUser();
    // this.GetUserActivities();
  }

  private async GetUserId() {
    //Fungsi untuk mengambil UserId pada local storage
    await this.storage.get('szUserId').then((szUserId) => {
      this.szUserId = szUserId;
    });
  }

  private GetTimeWorkingAndStatusUser() {
    //Fungsi untuk melakukan setup pengambilan api
    var url = 'http://sihk.hutamakarya.com/apiabsen/transaksi.php';
    var data: Observable<any> = this.http.get(url + "?szUserId=" + this.szUserId);

    data.subscribe(hasil => {
      this.kehadiran = hasil;
      if (this.kehadiran.error == false) {
        var timeValidArrived = this.kehadiran.user.jam_datang_valid.split(':'); //get api read jam datang
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.txtTimeArrived = hour + ":" + minute + " " + ampm;

        var timeValidBack = this.kehadiran.user.jam_pulang_valid.split(':'); //get api read jam pulang 
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidBack);
        this.txtTimeBack = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;
      }
      else {
        this.txtTimeArrived = "";
        this.txtTimeBack = "";
      }

      //Method untuk mengubah status kerja
      this.SetStatusWork();
    });
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[2] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  private Timer() {
    setInterval(function () {
      this.ngOnInit();
    }.bind(this), 500);
  }

  ngOnInit() {
    var dateData = this.GetDate();

    this.txtDayNow = dateData.szDay + ", " + dateData.decDate + " " + dateData.decMonth + " " + dateData.decYear;
    this.txtTimeNow = this.CheckTime(dateData.decHour) + ":" + this.CheckTime(dateData.decMinute) + ":" + this.CheckTime(dateData.decSec) + " " + dateData.szAMPM;
  }

  private GetDate(): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date();

    dateData.decYear = date.getFullYear();
    dateData.decMonth = months[date.getMonth()];
    dateData.decMonth2 = date.getMonth() + 1;
    dateData.decDate = date.getDate();
    dateData.szDay = days[date.getDay()];
    dateData.decMinute = date.getMinutes();
    dateData.szMinute = dateData.decMinute < 10 ? "0" + dateData.decMinute : dateData.decMinute.toString();
    dateData.decHour = date.getHours();
    dateData.szHour = dateData.decHour < 10 ? "0" + dateData.decHour : dateData.decHour.toString();
    dateData.decSec = date.getSeconds();
    dateData.szAMPM = dateData.decHour > 12 ? "PM" : "AM";

    return dateData;
  }

  private CheckTime(i: any) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  DoRefresh(event: any) {
    this.ShowFirstLoadData();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async ButtonAbsen() {
    this.GetUserPosition();
    this.ValidateAbsen();
    this.storage.set('saveTimeArrived', this.timeArived);
    this.storage.set('saveTimeBack', this.timeBack);
    // if (this.geoLatitude <= -6.24508 && this.geoLatitude >= -6.24587 && this.geoLongitude >= 106.87269 && this.geoLongitude <= 106.87379) {
    //   this.ValidateAbsen();
    // } else {
    //   alert("Sorry you aren't in area");
    //   // this.presentPopover(1);
    // }
  }

  private GetUserPosition() {
    this.options = {
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.currentPos = pos;
      console.log(pos);
      this.geoLatitude = pos.coords.latitude;
      this.geoLongitude = pos.coords.longitude;
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
  }

  async ValidateAbsen() {
    var dateData = this.GetDate();
    var szActivityId: string;
    if (!this.txtTimeArrived) {
      this.timeArived = dateData.decHour + ":" + dateData.szMinute + ":" + dateData.decSec;
      this.txtDate = dateData.decYear + "/" + dateData.decMonth2 + "/" + dateData.decDate; // CEK TXTDATE

      if (this.timeArived > "08:10:00") {

        szActivityId = ActivityId.AC002;
        let navigationExtras: NavigationExtras = {
          state: {
            indexForm: szActivityId
          }
        }
        await this.GetDecisionFromUser(szActivityId, navigationExtras);
      }

      this.txtTimeArrived = dateData.szHour + ":" + dateData.szMinute + " " + dateData.szAMPM;
      this.SetStatusWork(); //method untuk ubah status kerja
      this.DoingAbsen();  //method untuk push api jam datang
    }
    else {
      this.timeBack = dateData.decHour + ":" + dateData.szMinute + ":" + dateData.decSec;// CEK
      if (this.timeBack < "17:00:00") {
        //mengarahkan ke component form-pulang-cepat
        szActivityId = ActivityId.AC004
        let navigationExtras: NavigationExtras = {
          state: {
            indexForm: szActivityId
          }
        }
        await this.GetDecisionFromUser(szActivityId, navigationExtras);
      }
      else if (this.timeBack > "17:45:00") {
        //mengarahkan ke component form-lembur
        szActivityId = ActivityId.AC005
        let navigationExtras: NavigationExtras = {
          state: {
            indexForm: szActivityId
          }
        }
        await this.GetDecisionFromUser(szActivityId, navigationExtras);
      }

      this.txtTimeBack = dateData.szHour + ":" + dateData.szMinute + " " + dateData.szAMPM; // CEK
      this.SetStatusWork(); //method untuk ubah status kerja
      this.DoingAbsen();  //method untuk push api jam datang
    }
  }

  private async GetDecisionFromUser(szActivityId: string, navigationExtras: NavigationExtras) {
    const alert = await this.alertController.create({
      mode: 'ios',
      message: 'This is an alert message.',
      cssClass: szActivityId == ActivityId.AC001 ? 'alert-ontime' :
        szActivityId == ActivityId.AC003 ? 'alert-diluarkantor' :
          szActivityId == "DILUAR-WIFIAKSES" ? 'alert-wifiakses' :
            szActivityId == ActivityId.AC005 ? 'alert-lembur' :
              szActivityId == ActivityId.AC002 ? 'alert-terlambat' :
                szActivityId == ActivityId.AC004 ? 'alert-pulangcepat' :
                  'alert-pulang',
      buttons: szActivityId == ActivityId.AC003 ? [{
        text: 'BACK',
        handler: () => {
          console.log('Confirm Cancel: BACK');
        }
      }, {
        text: 'NEXT',
        handler: () => {
          this.router.navigate(['form-request'], navigationExtras);
        }
      }] :
        szActivityId == "DILUAR-WIFIAKSES" ? [{
          text: 'BACK',
          handler: () => {
            console.log('Confirm Cancel: BACK');
          }
        }] : szActivityId == ActivityId.AC005 ||
          szActivityId == ActivityId.AC002 ||
          szActivityId == ActivityId.AC004 ? [{
            text: 'NO',
            handler: () => {
              console.log('Confirm Cancel: NO');
            }
          }, {
            text: 'YES',
            handler: () => {
              this.router.navigate(['form-request'], navigationExtras);
            }
          }] : [{
            text: 'OK',
            handler: () => {
              console.log('Confirm Cancel: OK');
            }
          }]
    });
    await alert.present();
  }

  private SetStatusWork() {
    if (!this.txtTimeArrived) {
      this.txtWorkStatus = "Not Working";
      this.colorStatus = "danger";
    }
    else {
      if (this.txtTimeBack == "") {
        this.txtWorkStatus = "Working";
        this.colorStatus = "primary";
      } else {
        this.txtWorkStatus = "Not Working";
        this.colorStatus = "danger";
      }
    }
  }

  private DoingAbsen() {
    // throw new Error("Method not implemented.");
    var tanggal = this.txtDate;
    var jamdatang = this.timeArived;
    if (!this.txtTimeBack) {
      var jamplg = "00:00:00";
      var url = 'http://sihk.hutamakarya.com/apiabsen/absendatang.php';
    } else {
      var jamplg = this.timeBack;
      var url = 'http://sihk.hutamakarya.com/apiabsen/absenpulang.php';
    }
    var nik = this.szUserId;
    console.log(nik);

    let postdata = new FormData();
    postdata.append('szUserId', nik);
    postdata.append('jamdt', jamdatang);
    postdata.append('jamdtvld', jamdatang);
    postdata.append('jamplg', jamplg);
    postdata.append('jamplgvld', jamplg);
    postdata.append('tanggal', tanggal);

    var data: Observable<any> = this.http.post(url, postdata);
    data.subscribe(hasil => {
      this.kehadiran = hasil;
    });
  }

  Logout() {
    this.authService.logout();
  }

  navigateToReportPage(indexReport: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        indexReport: indexReport
      }
    };
    this.router.navigate(['reports'], navigationExtras);
  }

  navigateToNotificationsPage() {
    this.router.navigate(['notifications'])
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'pop-over-style'
    });

    popover.style.cssText = '--min-width: 300px; --box-shadow: #15ff00';
    return await popover.present();
  }
}

class DateData {
  public szDay: string;
  public decDate: number;
  public decMonth: string;
  public decYear: number;
  public decHour: number;
  public szHour: string;
  public decMinute: number;
  public szMinute: string;
  public szAMPM: string;
  public decSec: number;
  decMonth2: number;
  day2: number;

  constructor() { }
}