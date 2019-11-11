import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Component } from '@angular/core';
import { PopoverController, AlertController, NavController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { GlobalService, ActivityId, DateData, ReportData } from '../services/global.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public txtDayNow: string;
  public txtTimeNow: string;
  public txtTimeArrived: string;
  public txtTimeReturn: string = "";
  public txtWorkStatus: string = "";
  public colorStatus: string;

  constructor(public navCtrl: NavController, public alertController: AlertController,
    public router: Router,
    public geolocation: Geolocation,
    public http: HttpClient,
    public popoverController: PopoverController,
    private globalService: GlobalService,
    private platform: Platform,
    private statusBar: StatusBar
  ) {
    this.InitializeApp();
    this.InitializeData();
    this.Timer();
  }

  InitializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
    });
  }

  async InitializeData() {
    await this.globalService.GetUserDataFromStorage();
  }

  private GetTimeWorkingAndStatusUser() {
    var date = new Date();
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetReportDatas.php';
    let postdata = new FormData();

    postdata.append('szUserId', this.globalService.userData.szUserId);
    postdata.append('dateStart', date.toLocaleString());
    postdata.append('dateEnd', date.toLocaleString());

    var data: Observable<any> = this.http.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        var reportDataFromDb = data.result.find(x => x);
        var reportData = this.MappingReportData(reportDataFromDb);

        var timeValidArrived = reportData.timeValidArrived.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.txtTimeArrived = hour + ":" + minute + " " + ampm;

        var timeValidBack = reportData.timeValidReturn.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidBack);
        this.txtTimeReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;

        if (this.txtTimeReturn != "")
          this.globalService.timeRequest = this.txtTimeReturn;
        else
          this.globalService.timeRequest = this.txtTimeArrived;
      }
      else {
        this.txtTimeArrived = "";
        this.txtTimeReturn = "";
      }

      this.SetStatusWork();
    });
  }

  private MappingReportData(reportDataFromDb: any) {
    var reportData = new ReportData();
    reportData.szUserId = reportDataFromDb.szuserid;
    reportData.dateAbsen = reportDataFromDb.dateabsen;
    reportData.timeArrived = reportDataFromDb.timearrived;
    reportData.timeValidArrived = reportDataFromDb.timevalidarrived;
    reportData.timeReturn = reportDataFromDb.timereturn;
    reportData.timeValidReturn = reportDataFromDb.timevalidreturn;
    reportData.decMonth = reportDataFromDb.decmonth;

    return reportData;
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[2] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  private Timer() {
    setInterval(function () {
      this.ShowRepeatData();
      // this.GetTimeWorkingAndStatusUser();
    }.bind(this), 500);
  }

  ShowRepeatData() {
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

  ionViewWillEnter() {
    this.GetTimeWorkingAndStatusUser();
  }

  DoRefresh(event: any) {
    this.InitializeData();
    this.GetTimeWorkingAndStatusUser();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async ButtonAbsen() {
    try {
      this.GetUserPosition();
      this.ValidateAbsen();
    }
    catch (e) {
      this.alertController.create({
        mode: 'ios',
        message: e.message,
        buttons: ['OK']
      }).then(alert => {
        return alert.present();
      });
    }
  }

  private GetUserPosition() {
    var options: GeolocationOptions = {
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
      this.globalService.geoLatitude = pos.coords.latitude;
      this.globalService.geoLongitude = pos.coords.longitude;
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
  }

  ValidateAbsen() {
    var dateData = this.globalService.GetDate();

    if (this.globalService.geoLatitude <= -6.24508 && this.globalService.geoLatitude >= -6.24587 && this.globalService.geoLongitude >= 106.87269 && this.globalService.geoLongitude <= 106.87379) {
      var reportData = new ReportData();
      var szActivityId: string;

      if (!this.txtTimeArrived) {
        reportData.timeArrived = dateData.szHour + ":" + dateData.szMinute + ":" + dateData.decSec;
        reportData.timeReturn = "00:00:00";
        this.DoingAbsen(dateData, reportData);
        this.GetTimeWorkingAndStatusUser();
        this.globalService.dateRequest = dateData.date.toLocaleDateString();

        if (reportData.timeArrived > "08:10:00") {
          szActivityId = ActivityId.AC002;
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: szActivityId
            }
          }
          this.GetDecisionFromUser(szActivityId, navigationExtras);
        }
      }
      else {
        reportData.timeArrived = "00:00:00";
        reportData.timeReturn = dateData.szHour + ":" + dateData.szMinute + ":" + dateData.decSec;
        this.DoingAbsen(dateData, reportData);
        this.GetTimeWorkingAndStatusUser();
        this.globalService.dateRequest = dateData.date.toLocaleDateString();

        if (reportData.timeReturn < "17:00:00") {
          //mengarahkan ke component form-pulang-cepat
          szActivityId = ActivityId.AC005
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: szActivityId
            }
          }
          this.GetDecisionFromUser(szActivityId, navigationExtras);
        }
        else if (reportData.timeReturn > "17:45:00") {
          //mengarahkan ke component form-lembur
          szActivityId = ActivityId.AC006
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: szActivityId
            }
          }
          this.GetDecisionFromUser(szActivityId, navigationExtras);
        }
      }
    }
    else {
      this.globalService.dateRequest = dateData.date.toLocaleDateString();
      this.globalService.timeRequest = dateData.szHour + ":" + dateData.szMinute + " " + dateData.szAMPM;

      if (!this.txtTimeArrived) {
        this.globalService.isArrived = true;
        szActivityId = ActivityId.AC003;
      }
      else {
        this.globalService.isArrived = false;
        szActivityId = ActivityId.AC004;
      }

      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: szActivityId
        }
      }
      this.GetDecisionFromUser(szActivityId, navigationExtras);
    }
  }

  private async GetDecisionFromUser(szActivityId: string, navigationExtras: NavigationExtras) {
    await this.alertController.create({
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
        role: 'Cancel'
      }, {
        text: 'NEXT',
        handler: () => {
          this.router.navigate(['form-request'], navigationExtras);
        }
      }] :
        szActivityId == "DILUAR-WIFIAKSES" ? [{
          text: 'BACK',
          role: 'Cancel'
        }] : szActivityId == ActivityId.AC002 ||
          szActivityId == ActivityId.AC005 ||
          szActivityId == ActivityId.AC006 ? [{
            text: 'NO',
            role: 'Cancel'
          }, {
            text: 'YES',
            handler: () => {
              this.router.navigate(['form-request'], navigationExtras);
            }
          }] : [{
            text: 'OK',
            role: 'Cancel'
          }]
    }).then(alert => {
      return alert.present();
    });
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
    reportData.szUserId = this.globalService.userData.szUserId;
    reportData.dateAbsen = dateData.date.toDateString();
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
}

