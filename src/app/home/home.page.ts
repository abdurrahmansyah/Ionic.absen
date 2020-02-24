import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Component, ViewChild } from '@angular/core';
import { PopoverController, AlertController, NavController, Platform, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { GlobalService, ActivityId, ReportData, LeaderboardData } from '../services/global.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DatePipe } from '@angular/common';
import { FCM } from '@ionic-native/fcm/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

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
  public buttonPropertyDatas = [];
  public userImage: any;
  public userName: string;
  public leadName: string;
  public leadDivisionName: string;
  public leadImage: any;
  private loading: any;
  private subscription: any;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;

  constructor(public navCtrl: NavController, public alertController: AlertController,
    public router: Router,
    public geolocation: Geolocation,
    public http: HttpClient,
    public popoverController: PopoverController,
    private globalService: GlobalService,
    private platform: Platform,
    private statusBar: StatusBar,
    private localNotifications: LocalNotifications,
    private datePipe: DatePipe,
    private fcm: FCM,
    private loadingController: LoadingController,
    private diagnostic: Diagnostic
  ) {
    this.InitializeApp();
    this.InitializeLoadingCtrl();
    this.InitializeData();
    this.Timer();
  }

  InitializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
    });
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  async InitializeData() {
    await this.globalService.GetUserDataFromStorage();
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log('Received in background');
        this.router.navigate([data.landing_page, data.price]);
      } else {
        console.log('Received in foreground');
        this.router.navigate([data.landing_page, data.price]);
      }
    });
    this.cobadeh = this.globalService.userData.szUserId;
    this.userImage = this.globalService.userData.szImage;
    this.userName = this.globalService.userData.szUserName;
    this.fcm.subscribeToTopic(this.cobadeh);
  }

  private GetTimeWorkingAndStatusUser() {
    var dateData = this.globalService.GetDate();

    var url = 'https://absensi.hutamakarya.com/api/attendance/perdate';
    let postdata = new FormData();

    postdata.append('authorization', this.globalService.userData.szToken);
    postdata.append('date', this.datePipe.transform(dateData.date, 'yyyy-MM-dd'));

    var data: Observable<any> = this.http.post(url, postdata);
    this.SubscribeGetReportDatas(data, false);
  }

  private async SubscribeGetReportDatas(data: Observable<any>, isDoingAbsen: boolean) {
    data.subscribe(data => {
      if (data.response == "success") {
        var reportDataFromDb = data.data ? data.data : data.data_db;
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

        if (isDoingAbsen) {
          this.loadingController.dismiss();
          if (reportData.timeValidReturn == "00:00")
            this.PresentNotif(true);
          else
            this.PresentNotif(false);
          // this.globalService.PresentToast("Berhasil melakukan absensi");
        }
      }
      else {
        this.txtTimeArrived = "";
        this.txtTimeReturn = "";

        if (isDoingAbsen) {
          this.loadingController.dismiss();
          this.globalService.PresentToast("Gagal melakukan absensi");
        }
      }

      this.SetStatusWork();
    });
  }

  private MappingReportData(reportDataFromDb: any) {
    var reportDatas = [];
    var reportData = new ReportData();
    reportData.szUserId = reportDataFromDb.employee_id;
    reportData.dateAbsen = reportDataFromDb.check_in_display ? reportDataFromDb.check_in_display.split(' ')[0] : reportDataFromDb.check_out_display.split(' ')[0];
    reportData.timeValidArrived = reportDataFromDb.check_in_display ? reportDataFromDb.check_in_display.split(' ')[1] : this.txtTimeArrived.split(' ')[0];
    reportData.timeValidReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";

    reportDatas.push(reportData);
    return reportDatas.find(x => x);
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[0] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  private GetLeaderboardDataList() {
    var dateData = this.globalService.GetDate();

    var url = 'https://absensi.hutamakarya.com/api/get_ontime_employee?date=' + this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
    // let postdata = new FormData();

    // postdata.append('date', this.datePipe.transform(dateData.date, 'yyyy-MM-dd'));

    // var data: Observable<any> = this.http.post(url, postdata);
    var data: Observable<any> = this.http.get(url);
    this.SubscribeGetLeaderboardDataList(data);
  }

  private SubscribeGetLeaderboardDataList(data: Observable<any>) {
    data.subscribe(data => {
      if (data.response == "success") {
        var leaderboardDataFromDb = data.data;
        var leaderboardData = this.MappingLeaderboardData(leaderboardDataFromDb);

        this.leadName = leaderboardData.szUserName;
        this.leadDivisionName = leaderboardData.szDivisionName;
        this.leadImage = 'data:image/jpeg;base64,' + leaderboardData.szImage;
      }
    });
  }

  private MappingLeaderboardData(leaderboardDataFromDb: any) {
    var leaderboardDataList = [];

    leaderboardDataFromDb.forEach(ldrbrdData => {
      var leaderboardData = new LeaderboardData();
      leaderboardData.szUserId = ldrbrdData.nik;
      leaderboardData.szUserName = ldrbrdData.name;
      leaderboardData.szDivisionName = ldrbrdData.divisi;
      leaderboardData.szSectionName = ldrbrdData.department;
      leaderboardData.szSuperiorUserName = ldrbrdData.manager;
      leaderboardData.szImage = ldrbrdData.image;
      leaderboardDataList.push(leaderboardData);
    });

    // return leaderboardDataList;
    return leaderboardDataList.find(x => x);
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
    this.GetLeaderboardDataList();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
    this.swipebackEnabled = false;
  }

  get swipebackEnabled(): boolean {
    if (this.routerOutlet) {
      return this.routerOutlet.swipeGesture;
    } else {
      throw new Error('Call init() first!');
    }
  }

  set swipebackEnabled(value: boolean) {
    if (this.routerOutlet) {
      this.routerOutlet.swipeGesture = value;
    } else {
      throw new Error('Call init() first!');
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  DoRefresh(event: any) {
    this.GetTimeWorkingAndStatusUser();
    this.GetLeaderboardDataList();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async ButtonAbsen() {
    try {
      this.PresentLoading();
      this.GetUserPositionThenValidateAbsen();
    }
    catch (e) {
      this.loadingController.dismiss();
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
    let successCallback = (enabled) => {
      if (enabled) {
        // var options: GeolocationOptions = {
        //   enableHighAccuracy: true
        // };

        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((pos: Geoposition) => {
          this.globalService.geoLatitude = pos.coords.latitude;
          this.globalService.geoLongitude = pos.coords.longitude;

          this.ValidateAbsen();
        }).catch((error) => {
          // this.loadingController.dismiss();
          // this.alertController.create({
          //   mode: 'ios',
          //   message: "Tidak dapat mengakses lokasi: Aktifkan GPS anda",
          //   buttons: ['OK']
          // }).then(alert => {
          //   return alert.present();
          // });

          throw new Error(error.message);
        });
      }
      else
        throw new Error("Tidak dapat mengakses lokasi: Aktifkan GPS anda");
    }
    let errorCallback = (e) => {
      this.loadingController.dismiss();
      this.alertController.create({
        mode: 'ios',
        message: e.message,
        buttons: ['OK']
      }).then(alert => {
        return alert.present();
      });
    };

    this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
  }

  // private GetUserPositionThenValidateAbsen() {
  //   var options: GeolocationOptions = {
  //     enableHighAccuracy: true
  //   };
  //   this.geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
  //     this.globalService.geoLatitude = pos.coords.latitude;
  //     this.globalService.geoLongitude = pos.coords.longitude;

  //     this.ValidateAbsen();
  //   }, (err: PositionError) => {
  //     this.loadingController.dismiss();
  //     this.alertController.create({
  //       mode: 'ios',
  //       message: "Tidak dapat mengakses lokasi: Aktifkan GPS anda",
  //       buttons: ['OK']
  //     }).then(alert => {
  //       return alert.present();
  //     });

  //     // throw new Error("error : " + err.message);
  //   });
  // }

  private ValidateAbsen() {
    var dateData = this.globalService.GetDate();
    var reportData = new ReportData();
    console.log(this.globalService.geoLongitude);
    console.log(this.globalService.geoLatitude);

    // if (true) {
    if (
      this.globalService.geoLatitude <= -6.24508
      && this.globalService.geoLatitude >= -6.24587
      && this.globalService.geoLongitude >= 106.87269
      && this.globalService.geoLongitude <= 106.87379) {

      reportData.szUserId = this.globalService.userData.szToken;
      reportData.dateAbsen = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
      reportData.timeAbsen = dateData.szHour + ":" + dateData.szMinute;
      reportData.isRequest = "0";

      if (!this.txtTimeArrived) {
        if (reportData.timeAbsen > this.globalService.officeHourData.endtOfficeHourFrom) {
          reportData.szActivityId = "belumcheckin";
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
          reportData.isRequest = "1";
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: reportData.szActivityId
            }
          }
          this.GetDecisionFromUser(reportData, navigationExtras);
        }
        else if (reportData.timeAbsen > "17:45") {
          reportData.szActivityId = this.globalService.activityDataList.lembur.id;
          reportData.isRequest = "1";
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: reportData.szActivityId
            }
          }
          this.DoingAbsenWithRequest(reportData);
          // this.GetDecisionFromUser(reportData, navigationExtras);
        }
        else {
          this.DoingAbsen(reportData);
        }
      }
    }
    else {
      reportData.szUserId = this.globalService.userData.szToken;
      reportData.dateAbsen = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
      reportData.timeAbsen = dateData.szHour + ":" + dateData.szMinute;
      reportData.isRequest = "1";

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
      if (this.globalService.userData.szUserId == "KD19.9797") {
        this.DoingAbsen(reportData);
      }
      else
        this.GetDecisionFromUser(reportData, navigationExtras);
    }
  }

  private async GetDecisionFromUser(reportData: ReportData, navigationExtras: NavigationExtras) {
    this.loadingController.dismiss();
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
                  reportData.szActivityId == "belumcheckin" ? 'alert-belumcheckin' :
                    'alert-pulang',
      buttons: reportData.szActivityId == this.globalService.activityDataList.datangDiluarKantor.id || reportData.szActivityId == this.globalService.activityDataList.pulangDiluarKantor.id ? [{
        text: 'CANCEL',
        role: 'Cancel'
      }, {
        text: 'NEXT',
        handler: () => {
          this.globalService.dateRequest = reportData.dateAbsen;
          this.globalService.timeRequest = reportData.timeAbsen;
          window.open("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId, '_system', 'location=yes');
          // this.router.navigate(['form-request'], navigationExtras);
        }
      }] :
        reportData.szActivityId == "DILUAR-WIFIAKSES" ? [{
          text: 'BACK',
          role: 'Cancel'
        }] : // reportData.szActivityId == this.globalService.activityDataList.terlambat.id ||
          reportData.szActivityId == this.globalService.activityDataList.pulangCepat.id // ||
            // reportData.szActivityId == this.globalService.activityDataList.lembur.id 
            ? [{
              text: 'CANCEL',
              role: 'Cancel'
            }, {
              text: 'YES',
              handler: () => {
                this.globalService.dateRequest = reportData.dateAbsen;
                this.globalService.timeRequest = reportData.timeAbsen;
                this.DoingAbsenWithRequest(reportData);
                // this.router.navigate(['form-request'], navigationExtras);
              }
            }] : reportData.szActivityId == "belumcheckin" ? [{
              text: 'CANCEL',
              role: 'Cancel'
            }, {
              text: 'YES',
              handler: () => {
                this.globalService.dateRequest = reportData.dateAbsen;
                this.globalService.timeRequest = reportData.timeAbsen;
                window.open("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId, '_system', 'location=yes');
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
      this.txtWorkStatus = " Not Working";
      this.colorStatus = "danger";
    }
    else {
      if (this.txtTimeReturn == "") {
        this.txtWorkStatus = " Working";
        this.colorStatus = "primary";
      } else {
        this.txtWorkStatus = " Not Working";
        this.colorStatus = "danger";
      }
    }
  }

  private async DoingAbsen(reportData: ReportData) {
    var data = this.globalService.SaveReportData(reportData);
    this.SubscribeGetReportDatas(data, true);
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

  private DoingAbsenWithRequest(reportData: ReportData) {
    this.DoingAbsen(reportData);
    // var data = this.globalService.SaveReportDataWithRequest(reportData);
    // this.SubscribeGetReportDatas(data, true);
  }

  NavigateToReportPage(indexReport: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        indexReport: indexReport
      }
    };
    // this.router.navigate(['reports'], navigationExtras);
    this.router.navigate(['attendance']);
  }

  NavigateToSettingsPage() {
    this.router.navigate(['settings']);
  }

  NavRouterMenu(index: number) {
    if (index == 0) {
      this.router.navigate(['leaderboards']);
    }
    else if (index == 1) {
      this.router.navigate(['attendance']);
    }
    else if (index == 2) {
      this.router.navigate(['work-permit']);
    }
    else if (index == 3) {
      this.router.navigate(['notifications']);
    }
    else if (index == 4) {
      window.open("https://servicedesk.hutamakarya.com/", '_system', 'location=yes');
    }
  }

  async PresentLoading() {
    await this.loading.present();
  }
}

