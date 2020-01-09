import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Component } from '@angular/core';
import { PopoverController, AlertController, NavController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { GlobalService, ActivityId, DateData, ReportData } from '../services/global.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DatePipe } from '@angular/common';
import { FCM } from '@ionic-native/fcm/ngx';

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
  public cobadeh: string;

  constructor(public navCtrl: NavController, public alertController: AlertController,
    public router: Router,
    public geolocation: Geolocation,
    public http: HttpClient,
    public popoverController: PopoverController,
    private globalService: GlobalService,
    private platform: Platform,
    private statusBar: StatusBar,
    private localNotifications: LocalNotifications,
    private datePipe: DatePipe
    private fcm: FCM
  ) {
    this.Timer();
  }

  private GetTimeWorkingAndStatusUser() {
    var dateData = this.globalService.GetDate();

    var url = 'http://192.168.12.23/api/attendance/perdate';
    let postdata = new FormData();

    postdata.append('authorization', this.globalService.userData.szToken);
    postdata.append('date', this.datePipe.transform(dateData.date, 'yyyy-MM-dd'));

    var data: Observable<any> = this.http.post(url, postdata);
    this.SubscribeGetReportDatas(data);
  }

  private SubscribeGetReportDatas(data: Observable<any>) {
    data.subscribe(data => {
      if (data.response == "success") {
        var reportDataFromDb = data.data;
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
    var reportDatas = [];
    var reportData = new ReportData();
    reportData.szUserId = reportDataFromDb.szuserid;
    reportData.dateAbsen = reportDataFromDb.check_in_display.split(' ')[0];
    // reportData.timeArrived = reportDataFromDb.check_in_display.split(' ')[1];
    reportData.timeValidArrived = reportDataFromDb.check_in_display.split(' ')[1];
    // reportData.timeReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";
    reportData.timeValidReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";

    reportDatas.push(reportData);
    return reportDatas.find(x => x);
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
    this.GetTimeWorkingAndStatusUser();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async ButtonAbsen() {
    try {
      this.GetUserPositionThenValidateAbsen();
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

  private GetUserPositionThenValidateAbsen() {
    var options: GeolocationOptions = {
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
      this.globalService.geoLatitude = pos.coords.latitude;
      this.globalService.geoLongitude = pos.coords.longitude;

      this.ValidateAbsen();
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
  }

  private ValidateAbsen() {
    var dateData = this.globalService.GetDate();
    var reportData = new ReportData();

    if (false) {//this.globalService.geoLatitude <= -6.24508
      // && this.globalService.geoLatitude >= -6.24587
      // && this.globalService.geoLongitude >= 106.87269
      // && this.globalService.geoLongitude <= 106.87379) {
      reportData.szUserId = this.globalService.userData.szToken;
      reportData.dateAbsen = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
      reportData.timeAbsen = dateData.szHour + ":" + dateData.szMinute;

      if (!this.txtTimeArrived) {
        if (reportData.timeAbsen > this.globalService.officeHourData.startOfficeHourUntil) {
          reportData.szActivityId = this.globalService.activityDataList.terlambat.id;
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: reportData.szActivityId
            }
          }
          this.GetDecisionFromUser(reportData, navigationExtras);
        }
        else {
          this.DoingAbsen(reportData);
        }
      }
      else {
        if (reportData.timeAbsen < this.globalService.officeHourData.endtOfficeHourFrom) {
          reportData.szActivityId = this.globalService.activityDataList.pulangCepat.id;
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: reportData.szActivityId
            }
          }
          this.GetDecisionFromUser(reportData, navigationExtras);
        }
        else if (reportData.timeAbsen > "17:45") {
          reportData.szActivityId = this.globalService.activityDataList.lembur.id;
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: reportData.szActivityId
            }
          }
          this.GetDecisionFromUser(reportData, navigationExtras);
        }
        else {
          this.DoingAbsen(reportData);
        }
      }
    }
    else {
      reportData.dateAbsen = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
      reportData.timeAbsen = dateData.szHour + ":" + dateData.szMinute;

      if (!this.txtTimeArrived) {
        this.globalService.isArrived = true;
        reportData.szActivityId = this.globalService.activityDataList.datangDiluarKantor.id;
      }
      else {
        this.globalService.isArrived = false;
        reportData.szActivityId = this.globalService.activityDataList.pulangDiluarKantor.id;
      }

      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: reportData.szActivityId
        }
      }
      this.GetDecisionFromUser(reportData, navigationExtras);
    }
  }

  private async GetDecisionFromUser(reportData: ReportData, navigationExtras: NavigationExtras) {
    await this.alertController.create({
      mode: 'ios',
      message: 'This is an alert message.',
      backdropDismiss: reportData.szActivityId == this.globalService.activityDataList.datangDiluarKantor.id || reportData.szActivityId == this.globalService.activityDataList.pulangDiluarKantor.id ? true : false,
      cssClass: reportData.szActivityId == ActivityId.AC001 ? 'alert-ontime' :
        reportData.szActivityId == this.globalService.activityDataList.datangDiluarKantor.id || reportData.szActivityId == this.globalService.activityDataList.pulangDiluarKantor.id ? 'alert-diluarkantor' :
          reportData.szActivityId == "DILUAR-WIFIAKSES" ? 'alert-wifiakses' :
            reportData.szActivityId == this.globalService.activityDataList.lembur.id ? 'alert-lembur' :
              reportData.szActivityId == this.globalService.activityDataList.terlambat.id ? 'alert-terlambat' :
                reportData.szActivityId == this.globalService.activityDataList.pulangCepat.id ? 'alert-pulangcepat' :
                  'alert-pulang',
      buttons: reportData.szActivityId == this.globalService.activityDataList.datangDiluarKantor.id || reportData.szActivityId == this.globalService.activityDataList.pulangDiluarKantor.id ? [{
        text: 'BACK',
        role: 'Cancel'
      }, {
        text: 'NEXT',
        handler: () => {
          this.globalService.dateRequest = reportData.dateAbsen;
          this.globalService.timeRequest = reportData.timeAbsen;
          this.router.navigate(['form-request'], navigationExtras);
        }
      }] :
        reportData.szActivityId == "DILUAR-WIFIAKSES" ? [{
          text: 'BACK',
          role: 'Cancel'
        }] : reportData.szActivityId == this.globalService.activityDataList.terlambat.id ||
          reportData.szActivityId == this.globalService.activityDataList.pulangCepat.id ||
          reportData.szActivityId == this.globalService.activityDataList.lembur.id ? [{
            text: 'NO',
            handler: () => {
              this.DoingAbsen(reportData);
            }
          }, {
            text: 'YES',
            handler: () => {
              this.globalService.dateRequest = reportData.dateAbsen;
              this.globalService.timeRequest = reportData.timeAbsen;
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

  private DoingAbsen(reportData: ReportData) {
    var data = this.globalService.SaveReportData(reportData);
    this.SubscribeGetReportDatas(data);
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

