import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { AuthenticationService } from './../services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { GlobalService, ActivityId, DateData, ReportData, UserData } from '../services/global.service';

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
  public txtDate: string;
  public txtTimeReturn: string = "";
  public txtWorkStatus: string = "";
  geoAccuracy: number;
  // userData: UserData = new UserData();
  colorStatus: string;
  public buttonPropertyDatas = [];
  error: void;
  options: GeolocationOptions;
  currentPos: Geoposition;
  popoverParam: any;

  constructor(public navCtrl: NavController, public alertController: AlertController,
    public router: Router,
    public geolocation: Geolocation,
    public http: HttpClient,
    public popoverController: PopoverController,
    private globalService: GlobalService
  ) {
    this.ShowFirstLoadData();
    this.Timer();
  }

  async ShowFirstLoadData() {
    await this.globalService.GetUserDataFromStorage();
    
    this.GetTimeWorkingAndStatusUser();
  }

  private GetTimeWorkingAndStatusUser() {
    var date = new Date();
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetReportData.php';
    let postdata = new FormData();
    
    postdata.append('szUserId', this.globalService.userData.szUserId);
    postdata.append('dateAbsen', date.toLocaleString());

    var data: Observable<any> = this.http.post(url, postdata);
    data.subscribe(reportDatas => {
      if (reportDatas.error == false) {
        var timeValidArrived = reportDatas.user.timeValidArrived.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.txtTimeArrived = hour + ":" + minute + " " + ampm;
        var timeValidBack = reportDatas.user.timeValidReturn.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidBack);
        this.txtTimeReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;
      }
      else {
        this.txtTimeArrived = "";
        this.txtTimeReturn = "";
      }

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
    var dateData = this.globalService.GetDate();

    this.txtDayNow = dateData.szDay + ", " + dateData.decDate + " " + dateData.szMonth + " " + dateData.decYear;
    this.txtTimeNow = this.CheckTime(dateData.decHour) + ":" + this.CheckTime(dateData.decMinute) + ":" + this.CheckTime(dateData.decSec) + " " + dateData.szAMPM;
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
    // this.storage.set('saveTimeArrived', this.timeArived);
    // this.storage.set('saveTimeBack',this.timeReturn);
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
    var dateData = this.globalService.GetDate();
    var reportData = new ReportData();
    var szActivityId: string;
    if (!this.txtTimeArrived) {
      reportData.timeArrived = dateData.szHour + ":" + dateData.szMinute + ":" + dateData.decSec;

      if (reportData.timeArrived > "08:10:00") {
        szActivityId = ActivityId.AC002;
        let navigationExtras: NavigationExtras = {
          state: {
            indexForm: szActivityId
          }
        }
        await this.GetDecisionFromUser(szActivityId, navigationExtras);
      }

      this.DoingAbsen(dateData, reportData);
      this.txtTimeArrived = dateData.szHour + ":" + dateData.szMinute + " " + dateData.szAMPM;
      this.SetStatusWork();
    }
    else {
      reportData.timeReturn = dateData.szHour + ":" + dateData.szMinute + ":" + dateData.decSec;
      console.log(reportData.timeReturn);

      if (reportData.timeReturn < "17:00:00") {
        //mengarahkan ke component form-pulang-cepat
        szActivityId = ActivityId.AC005
        let navigationExtras: NavigationExtras = {
          state: {
            indexForm: szActivityId
          }
        }
        await this.GetDecisionFromUser(szActivityId, navigationExtras);
      }
      else if (reportData.timeReturn > "17:45:00") {
        //mengarahkan ke component form-lembur
        szActivityId = ActivityId.AC006
        let navigationExtras: NavigationExtras = {
          state: {
            indexForm: szActivityId
          }
        }
        await this.GetDecisionFromUser(szActivityId, navigationExtras);
      }

      this.DoingAbsen(dateData, reportData);
      this.txtTimeReturn = dateData.szHour + ":" + dateData.szMinute + " " + dateData.szAMPM;
      this.SetStatusWork();
    }
  }

  private async GetDecisionFromUser(szActivityId: string, navigationExtras: NavigationExtras) {
    const alert = await this.alertController.create({
      mode: 'ios',
      message: 'This is an alert message.',
      cssClass: szActivityId == ActivityId.AC001 ? 'alert-ontime' :
        szActivityId == ActivityId.AC003 || szActivityId == ActivityId.AC004 ? 'alert-diluarkantor' :
          szActivityId == "DILUAR-WIFIAKSES" ? 'alert-wifiakses' :
            szActivityId == ActivityId.AC006 ? 'alert-lembur' :
              szActivityId == ActivityId.AC002 ? 'alert-terlambat' :
                szActivityId == ActivityId.AC005 ? 'alert-pulangcepat' :
                  'alert-pulang',
      buttons: szActivityId == ActivityId.AC003 || szActivityId == ActivityId.AC004 ? [{
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
        }] : szActivityId == ActivityId.AC002 ||
          szActivityId == ActivityId.AC005 ||
          szActivityId == ActivityId.AC006 ? [{
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
      if (this.txtTimeReturn == "") {
        this.txtWorkStatus = "Working";
        this.colorStatus = "primary";
      } else {
        this.txtWorkStatus = "Not Working";
        this.colorStatus = "danger";
      }
    }
  }

  private DoingAbsen(dateData: DateData, reportData: ReportData) {
    var dateAbsen = dateData.decYear + "/" + dateData.decMonth + "/" + dateData.decDate;

    reportData.szUserId = this.globalService.userData.szUserId;
    reportData.dateAbsen = dateAbsen;
    this.globalService.SaveReportData(reportData);
  }

  NavigateToReportPage(indexReport: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        indexReport: indexReport
      }
    };
    this.router.navigate(['reports'], navigationExtras);
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

