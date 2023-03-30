import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Component, ViewChild } from '@angular/core';
import { PopoverController, AlertController, NavController, Platform, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService, ActivityId, ReportData, LeaderboardData, DateData, LocationData, AkhlakData } from '../services/global.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DatePipe } from '@angular/common';
import { FCM } from '@ionic-native/fcm/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Storage } from '@ionic/storage';

declare var window;
defineCustomElements(window);
export const USERDATA_KEY = 'userData';

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
  public akhlakImage: any;
  public isWFOWFHPlanning: boolean = false;
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
    private diagnostic: Diagnostic,
    private inAppBrowser: InAppBrowser,
    private openNativeSettings: OpenNativeSettings,
    private nativeGeocoder: NativeGeocoder,
    private appVersion: AppVersion,
    private backgroundGeolocation: BackgroundGeolocation,
    private backgroundMode: BackgroundMode,
    private appMinimize: AppMinimize,
    private storage: Storage
  ) {
    this.ValidateAppVersionNumber();
    this.InitializeApp();
    this.InitializeLoadingCtrl();
    this.InitializeData();
    this.Timer();
  }

  ValidateAppVersionNumber() {
    // var data = this.globalService.GetVersionNumber();
    // data.subscribe(data => {
    //   if (data.response == "success") {
    //     var versionNumberDb = data.data;

    //     this.appVersion.getVersionNumber().then((versionNumber) => {
    //       if (versionNumber < versionNumberDb)
    //         this.router.navigate(['warning-updates']);
    //     }).catch((error) => {
    //       // this.globalService.PresentAlert(error.message);
    //       this.router.navigate(['warning-updates']);
    //     });
    //   }
    // });
  }

  // public StartLocalNotification() {
  //   this.localNotifications.schedule([{
  //     id: 1,
  //     title: "Tracking WFH 1",
  //     text: "Anda berada diluar kantor, mohon minimize aplikasi namun tidak melakukan close app",
  //     data: { mydata: "TRACKING1" },
  //     trigger: { in: 1, unit: ELocalNotificationTriggerUnit.MINUTE }
  //   }, {
  //     id: 2,
  //     title: "Tracking WFH 2",
  //     text: "Anda berada diluar kantor, mohon minimize aplikasi namun tidak melakukan close app",
  //     data: { mydata: "TRACKING2" },
  //     trigger: { in: 2, unit: ELocalNotificationTriggerUnit.MINUTE }
  //   }, {
  //     id: 3,
  //     title: "Tracking WFH 3",
  //     text: "Anda berada diluar kantor, mohon minimize aplikasi namun tidak melakukan close app",
  //     data: { mydata: "TRACKING3" },
  //     trigger: { in: 3, unit: ELocalNotificationTriggerUnit.MINUTE }
  //   }]);
  // }

  InitializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();

      // this.localNotifications.on('click').subscribe(res => {
      //   this.globalService.PresentAlert("BUG : dari klik - " + res.text);
      // });

      // this.localNotifications.on('trigger').subscribe(res => {
      //   let msg = res.data ? res.data.mydata : "";
      //   if (msg.toUpperCase() == "TRACKING1".toUpperCase()) {
      //     window.app.backgroundGeolocation.start();
      //   }
      //   if (msg.toUpperCase() == "TRACKING2".toUpperCase()) {
      //     window.app.backgroundGeolocation.start();
      //   }
      //   if (msg.toUpperCase() == "TRACKING3".toUpperCase()) {
      //     window.app.backgroundGeolocation.start();
      //   }
      // });

      // this.localNotifications.on('schedule').subscribe(res => {
      //   this.globalService.PresentAlert("BUG : error from local notif schedule" + res.text);
      // });
    });

    this.backgroundMode.enable();
    this.backgroundGeolocation.switchMode(0);

    this.platform.backButton.subscribe(() => {
      // navigator['app'].appMinimize.minimize();
      // this.appMinimize.minimize();
      window.plugins.appMinimize.minimize();
      this.backgroundGeolocation.switchMode(1);
    });

    // this.swipebackEnabled = false;
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
    this.LoadMyEmployeeData();
    this.fcm.subscribeToTopic(this.cobadeh);

    this.GetCurrentPositionForFirst();
  }

  private LoadMyEmployeeData() {
    console.log("this.globalService.userData", this.globalService.userData);

    this.userImage = this.globalService.userData.szImage;
    this.userName = this.globalService.userData.szUserName;
  }

  private GetCurrentPositionForFirst() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((pos: Geoposition) => {
      this.globalService.geoLatitude = pos.coords.latitude;
      this.globalService.geoLongitude = pos.coords.longitude;
    }).catch((error) => {
      throw new Error(error.message);
    });
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
        var reportData: ReportData = this.MappingReportData(reportDataFromDb);

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

    var url = 'https://absensi.hutamakarya.com/api/attendance/employee_limit/ASC/1?date=' + this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
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

  private GetAkhlakDataList() {
    var dateData = this.globalService.GetDate();

    var url = 'https://absensi.hutamakarya.com/api/greetings';
    var data: Observable<any> = this.http.get(url);
    this.SubscribeGetAkhlakDataList(data);
  }

  private SubscribeGetAkhlakDataList(data: Observable<any>) {
    data.subscribe(data => {
      if (data.response == "success") {
        this.akhlakImage = 'data:image/jpeg;base64,' + data.data;
      }

      // if (data.response == "success") {
      //   var akhlakDataFromDb = data.data;
      //   var akhlakData = this.MappingAkhlakData(akhlakDataFromDb);
      //   console.log(data + " " + akhlakData.data);

      //   this.akhlakImage = 'data:image/jpeg;base64,' + akhlakData.data;
      //   console.log(this.akhlakImage);
      // }
    });
  }

  private MappingAkhlakData(akhlakDataFromDb: any) {
    var akhlakDataList = [];

    akhlakDataFromDb.forEach(aklkData => {
      var akhlakData = new AkhlakData();
      akhlakData.data = aklkData.data;
      akhlakDataList.push(akhlakData);
    });

    // return akhlakDataList;
    return akhlakDataList.find(x => x);
  }

  private GetWFOWFHPlanning() {
    this.isWFOWFHPlanning = true;
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
    setTimeout(() => {
      this.GetTimeWorkingAndStatusUser();
      this.GetLeaderboardDataList();
      this.GetAkhlakDataList();
      this.GetWFOWFHPlanning();
    }, 500);
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      // this.appMinimize.minimize();
      window.plugins.appMinimize.minimize();
      // navigator['app'].appMinimize.minimize();
      this.backgroundGeolocation.switchMode(1);
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

  DoRefresh(event?: any) {
    this.GetEmployeeInformation();
    this.GetTimeWorkingAndStatusUser();
    this.GetLeaderboardDataList();
    this.GetAkhlakDataList();
    this.ValidateAppVersionNumber();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  private GetEmployeeInformation() {
    var data: any = this.globalService.GetEmployeeInformationReturnObserve();
    data.subscribe(data => {
      if (data.response == "success") {
        var userDataFromDb = data.data;
        var userData = this.globalService.MappingUserData(userDataFromDb);

        this.globalService.userData = userData;
        this.LoadMyEmployeeData();
        this.storage.set(USERDATA_KEY, userData);
      }
      else {
        this.globalService.PresentAlert("BUG: Get Employe Information Failed");
      }
    });
  }

  public async ButtonAbsen() {
    // this.ValidateAbsen(true); // DIKOMEN KALAU TIDAK DIPAKAI

    try {
      this.InitializeLoadingCtrl();
      setTimeout(() => {
        this.PresentLoading();

        var data = this.globalService.GetVersionNumber();
        data.subscribe(data => {
          if (data.response == "success") {
            var versionNumberDb = data.data;

            this.appVersion.getVersionNumber().then((versionNumber) => {
              if (versionNumber < versionNumberDb) {
                this.loadingController.dismiss();
                this.router.navigate(['warning-updates']);
              }
              else
                this.GetUserPositionThenValidateAbsen();
            }, (rejected) => {
              this.loadingController.dismiss();
              this.globalService.PresentAlert(rejected.message)
            }).catch((error) => {
              this.globalService.PresentAlert(error.message);
              this.router.navigate(['warning-updates']);
            });
          }
          else {
            this.loadingController.dismiss();
            this.globalService.PresentAlert("BUG: Error API Version Number");
          }
        }, (err) => {
          this.loadingController.dismiss();
          this.globalService.PresentToast(err.message);
        });
      }, 100);
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

  async GetVersionNumberDB() {
    // this.InitializeLoadingCtrl();
    // this.PresentLoading();

    let loading = await this.loadingController.create({
      mode: 'ios'
    });
    loading.present();

    var data = this.globalService.GetVersionNumber();
    data.subscribe(data => {
      loading.dismiss();
      this.globalService.PresentAlert(JSON.stringify(data.data));
    }, (err) => {
      loading.dismiss();
      this.globalService.PresentToast("err GetVersionNumberDB: " + JSON.stringify(err));
    });
  }

  async GetVersionNumberNative() {
    // this.InitializeLoadingCtrl();
    // this.PresentLoading();

    let loading = await this.loadingController.create({
      mode: 'ios'
    });
    loading.present();

    this.appVersion.getVersionNumber().then((versionNumber) => {
      loading.dismiss();
      this.globalService.PresentAlert(versionNumber);
    }, (rejected) => {
      loading.dismiss();
      this.globalService.PresentAlert("reject GetVersionNumberNative: " + JSON.stringify(rejected));
    }).catch((error) => {
      loading.dismiss();
      this.globalService.PresentAlert("error GetVersionNumberNative: " + JSON.stringify(error));
    });
  }

  async isLocationAvailable() {
    // this.InitializeLoadingCtrl();
    // this.PresentLoading();

    let loading = await this.loadingController.create({
      mode: 'ios'
    });
    loading.present();

    this.diagnostic.isLocationAvailable().then((allowed) => {
      loading.dismiss();
      this.globalService.PresentAlert(JSON.stringify(allowed));
    }, (rejected) => {
      loading.dismiss();
      this.globalService.PresentAlert("reject isLocationAvailable: " + JSON.stringify(rejected));
    }).catch((e) => {
      loading.dismiss();
      this.globalService.PresentAlert("error isLocationAvailable: " + JSON.stringify(e));
    });
  }

  async getCurrentPosition() {
    // this.InitializeLoadingCtrl();
    // this.PresentLoading();

    let loading = await this.loadingController.create({
      mode: 'ios',
      duration: 10000,
    });
    loading.present();

    var latitude: number = 0;
    var longitude: number = 0;

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((pos: Geoposition) => {
      console.log(pos);

      this.globalService.timestamp = pos.timestamp;
      this.globalService.geoLatitude = pos.coords.latitude;
      this.globalService.geoLongitude = pos.coords.longitude;

      loading.dismiss();
      this.globalService.PresentAlert("res pos.coords: " + JSON.stringify(pos.coords));
      this.globalService.PresentToast("res pos.coords.latitude: " + pos.coords.latitude);
      this.globalService.PresentAlert("res pos.coords.longitude: " + pos.coords.longitude);
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
    }, (rejected) => {
      loading.dismiss();
      this.globalService.PresentAlert("reject getCurrentPosition: " + JSON.stringify(rejected));
    }).catch((error) => {
      loading.dismiss();
      this.globalService.PresentAlert("error getCurrentPosition: " + JSON.stringify(error));
    });

    setTimeout(() => {
      if (latitude == 0 && longitude == 0) {
        loading.dismiss();
        this.globalService.PresentAlert("nilai latitude dan longitude sama dengan kosong");
      } else {
        // loading.dismiss();
        this.globalService.PresentAlert("nilai latitude dan longitude tidak kosong");
      }
    }, 7000);
  }

  async reverseGeocode(latitude = -6.2462237, longitude = 106.8768418) {
    // this.InitializeLoadingCtrl();
    // this.PresentLoading();

    let loading = await this.loadingController.create({
      mode: 'ios'
    });
    loading.present();

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        loading.dismiss();
        this.globalService.PresentAlert(JSON.stringify(result));
      }, (rejected) => {
        loading.dismiss();
        this.globalService.PresentAlert("reject reverseGeocode: " + JSON.stringify(rejected));
      }).catch((error: any) => {
        loading.dismiss();
        this.globalService.PresentAlert("error reverseGeocode: " + JSON.stringify(error));
      });
  }

  private GetUserPositionThenValidateAbsen() {
    let successCallback = (enabled) => {
      if (enabled) {
        this.diagnostic.isLocationAvailable().then((allowed) => {
          if (allowed) {
            var latitude: number = 0;
            var longitude: number = 0;

            this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((pos: Geoposition) => {
              this.ReadGeocode(pos.coords.latitude, pos.coords.longitude);

              this.globalService.timestamp = pos.timestamp;
              this.globalService.geoLatitude = pos.coords.latitude;
              this.globalService.geoLongitude = pos.coords.longitude;
              latitude = pos.coords.latitude;
              longitude = pos.coords.longitude;

              this.ValidateAbsen(false);
            }, (rejected) => {
              this.loadingController.dismiss();
              this.globalService.PresentAlert(JSON.stringify(rejected));
            }).catch((error) => {
              this.loadingController.dismiss();
              this.globalService.PresentAlert(error.message);
            });

            setTimeout(() => {
              if (latitude == 0 && longitude == 0) {
                // this.loadingController.dismiss();
                // this.globalService.PresentAlert("nilai latitude dan longitude sama dengan kosong");

                this.ValidateAbsen(true);
              }
            }, 3000);
          }
          else {
            this.loadingController.dismiss();
            this.router.navigate(['warning-locations']);
          }
        }, (rejected) => {
          this.loadingController.dismiss();
          this.globalService.PresentAlert(JSON.stringify(rejected));
        }).catch((e) => {
          this.loadingController.dismiss();
          this.globalService.PresentAlert(e.message);
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

  private ReadGeocode(latitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        if (this.platform.is('ios'))
          this.MappingLocationGeocode(0, result);
        else
          this.MappingLocationGeocode(1, result);
      }, (rejected) => {
        this.loadingController.dismiss();
        this.globalService.PresentAlert(rejected.message)
      }).catch((error: any) => {
        this.loadingController.dismiss();
        this.globalService.PresentAlert(error.message);
      });
  }

  private MappingLocationGeocode(index: number, result: NativeGeocoderResult[]) {
    var thoroughfare = result[index].thoroughfare;
    var subThoroughfare = result[index].subThoroughfare;
    var subLocality = result[index].subLocality ? ", " + result[index].subLocality : "";
    var locality = result[index].locality ? ", " + result[index].locality : "";
    var subAdministrativeArea = result[index].subAdministrativeArea ? ", " + result[index].subAdministrativeArea : "";
    var administrativeArea = result[index].administrativeArea ? ", " + result[index].administrativeArea : "";
    var postalCode = result[index].postalCode ? " " + result[index].postalCode : "";
    this.globalService.kota = result[index].subAdministrativeArea;
    this.globalService.provinsi = result[index].administrativeArea;
    this.globalService.location = thoroughfare + subThoroughfare + subLocality + locality + subAdministrativeArea + administrativeArea + postalCode;
  }

  private ValidateAbsen(isAllOption) {
    var data = this.globalService.GetTimeNow();
    data.subscribe(data => {
      if (data.response == "success") {
        var time = data.data.split(':');

        var dateData = this.globalService.GetDateWithHourAndMinute(time[0], time[1]);
        // var dateData = this.globalService.GetDateWithHourAndMinute(8, 15);
        var reportData = new ReportData();
        reportData.dateAbsen = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
        reportData.timeAbsen = dateData.szHour + ":" + dateData.szMinute;

        console.log(this.globalService.geoLongitude);
        console.log(this.globalService.geoLatitude);

        if (isAllOption) {
          if (!this.txtTimeArrived) {
            this.globalService.isArrived = true;
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
              this.ByPassDoingAllOption(reportData, false);
            }
          } else {
            this.globalService.isArrived = false;
            this.ByPassDoingAllOption(reportData, false);
          }
        } else {
          // if (false) {
          if ( // DI HK TOWER
            this.globalService.geoLatitude <= -6.24508
            && this.globalService.geoLatitude >= -6.24587
            && this.globalService.geoLongitude >= 106.87269
            && this.globalService.geoLongitude <= 106.87379) {

            reportData.szUserId = this.globalService.userData.szToken;
            reportData.isRequest = "0";

            if (!this.txtTimeArrived) {
              this.globalService.isArrived = true;
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
                // Only For WFO - NEW NORMAL
                this.ByPassDoingAbsenWfoNewNormal(reportData, false);

                // BackUp If WFO - NORMAL DONE
                // this.DoingAbsen(reportData);
              }
            }
            else {
              this.globalService.isArrived = false;
              if (reportData.timeAbsen < this.globalService.officeHourData.endtOfficeHourFrom) {
                reportData.szActivityId = this.globalService.activityDataList.pulangCepat.id;
                reportData.szDesc = "Pulang Cepat";
                reportData.isRequest = "1";
                let navigationExtras: NavigationExtras = {
                  state: {
                    indexForm: reportData.szActivityId
                  }
                }
                this.ByPassDoingAbsenWfoNewNormal(reportData, false);
                // this.DoingAbsenWithRequest(reportData, true);
                // this.GetDecisionFromUser(reportData, navigationExtras); 
              }
              else if (reportData.timeAbsen > "17:45") {
                reportData.szActivityId = this.globalService.activityDataList.lembur.id;
                reportData.szDesc = "Lembur";
                reportData.isRequest = "1";
                let navigationExtras: NavigationExtras = {
                  state: {
                    indexForm: reportData.szActivityId
                  }
                }
                this.DoingAbsenWithRequest(reportData, true);
                // this.GetDecisionFromUser(reportData, navigationExtras);
              }
              else {
                this.DoingAbsenWithRequest(reportData, true);
                // this.DoingAbsen(reportData);
              }
            }
          }
          else { // DILUAR HK TOWER
            reportData.szUserId = this.globalService.userData.szToken;
            reportData.isRequest = "1";

            if (!this.txtTimeArrived) {
              this.globalService.isArrived = true;
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
                reportData.szActivityId = this.globalService.activityDataList.datangDiluarKantor.id;

                let navigationExtras: NavigationExtras = {
                  state: {
                    indexForm: reportData.szActivityId
                  }
                }
                this.GetDecisionFromUser(reportData, navigationExtras);
              }
            }
            else {
              this.globalService.isArrived = false;
              reportData.szActivityId = this.globalService.activityDataList.pulangDiluarKantor.id;

              let navigationExtras: NavigationExtras = {
                state: {
                  indexForm: reportData.szActivityId
                }
              }
              this.GetDecisionFromUser(reportData, navigationExtras);
            }
          }
        }
      }
      else {
        this.loadingController.dismiss();
        this.alertController.create({
          mode: 'ios',
          message: 'Connection Problem: Cannot Access Current Time',
          buttons: ['OK']
        }).then(alert => {
          return alert.present();
        });
      }
    });
  }

  private ByPassDoingAbsenWfoNewNormal(reportData: ReportData, isWfoProyek: boolean) {
    if (isWfoProyek)
      reportData.szActivityId = this.globalService.activityDataList.wfoProyek.id;
    else
      reportData.szActivityId = this.globalService.activityDataList.wfoNewNormal.id;

    let navigationExtras: NavigationExtras = {
      state: {
        indexForm: reportData.szActivityId
      }
    }
    this.loadingController.dismiss();

    this.globalService.dateRequest = reportData.dateAbsen;
    this.globalService.timeRequest = reportData.timeAbsen;
    this.router.navigate(['form-request'], navigationExtras);
  }

  private ByPassDoingAllOption(reportData: ReportData, isWfoProyek: boolean) {
    let navigationExtras: NavigationExtras = {
      state: {
        indexForm: 'isAllOption'
      }
    }
    this.loadingController.dismiss();

    this.globalService.dateRequest = reportData.dateAbsen;
    this.globalService.timeRequest = reportData.timeAbsen;
    this.router.navigate(['form-request'], navigationExtras);
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
      buttons: reportData.szActivityId == this.globalService.activityDataList.datangDiluarKantor.id ? [{
        text: 'WFO - Proyek',
        handler: () => {
          this.ByPassDoingAbsenWfoNewNormal(reportData, true);
        }        // role: 'Cancel'
      }, {
        text: 'WFH',
        handler: () => {
          this.globalService.dateRequest = reportData.dateAbsen;
          this.globalService.timeRequest = reportData.timeAbsen;
          this.globalService.diluarKantor = reportData.szActivityId;
          this.router.navigate(['form-request'], navigationExtras);
        }
      }] : reportData.szActivityId == this.globalService.activityDataList.pulangDiluarKantor.id ? [{
        text: 'WFO - Proyek',
        handler: () => {
          this.ByPassDoingAbsenWfoNewNormal(reportData, true);
          // this.DoingAbsenWithRequest(reportData, false);
        }        // role: 'Cancel'
      }, {
        text: 'WFH',
        handler: () => {
          this.globalService.dateRequest = reportData.dateAbsen;
          this.globalService.timeRequest = reportData.timeAbsen;
          this.globalService.diluarKantor = reportData.szActivityId;
          this.router.navigate(['form-request'], navigationExtras);
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
                this.DoingAbsenWithRequest(reportData, true);
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
                this.inAppBrowser.create("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId);
                // window.open("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId, '_system', 'location=yes');
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

  private DoingAbsenWithRequest(reportData: ReportData, isKantorPusat: Boolean) {
    // reportData.szActivityId = "";
    reportData.szLocation = isKantorPusat ? "HK Tower" : this.globalService.location;
    reportData.kota = isKantorPusat ? "Kota Jakarta Timur" : this.globalService.kota;
    reportData.provinsi = isKantorPusat ? "Daerah Khusus Ibukota Jakarta" : this.globalService.provinsi;
    reportData.isRequest = "1";

    var data = this.globalService.SaveReportDataWithRequest(reportData);
    this.SubscribeGetReportDatas(data, true);
    // this.globalService.CancelLocalNotification();
  }

  NavigateToReportPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        // indexReport: indexReport
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
      // this.router.navigate(['reports']);
    }
    else if (index == 2) {
      this.router.navigate(['work-permit']);
    }
    else if (index == 3) {
      this.router.navigate(['notifications']);
    }
    else if (index == 4) {
      // window.open("https://servicedesk.hutamakarya.com/", '_system', 'location=yes');
      this.inAppBrowser.create("https://servicedesk.hutamakarya.com/");
    }
    else if (index == 5) {
      this.router.navigate(['my-activity']);
    }
    else if (index == 6) {
      this.router.navigate(['team-activity']);
    }
    else if (index == 7) {
      this.router.navigate(['wfowfh-planning']);
    }
  }

  async PresentLoading() {
    // this.loading = await this.loadingController.create({
    //   mode: 'ios'
    // });
    // this.loading.present();
    await this.loading.present();
  }
}