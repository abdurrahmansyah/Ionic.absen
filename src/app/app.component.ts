import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';

//page-page
import { HomePage } from 'src/app/home/home.page';
import { LoginPage } from 'src/app/pages/login/login.page'

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { GlobalService, LocationData } from './services/global.service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

declare var window;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  rootPage: any;
  public UserLogin: string;
  nav: any;
  cobadeh: string;
  counter: number = 1;
  subscription: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private authenticationService: AuthenticationService,
    private router: Router,
    private fcm: FCM,
    private globalService: GlobalService,
    private backgroundGeolocation: BackgroundGeolocation,
    private nativeGeocoder: NativeGeocoder,
    private datePipe: DatePipe,
    private appMinimize: AppMinimize
  ) {
    this.storage.get('username').then(data => {
      if (data) {
        this.rootPage = HomePage;
        this.storage.get('name').then((nama) => {
          this.UserLogin = nama;
        });
      }
      else {
        this.rootPage = LoginPage;
      }
    });
    this.initializeApp();
    this.InitializeData();
  }

  initializeApp() {
    this.fcm.getToken().then(token => {
      console.log(token);
    });

    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      // this.statusBar.styleDefault();
      this.splashScreen.hide();

      // const config: BackgroundGeolocationConfig = {
      //   desiredAccuracy: 10,
      //   stationaryRadius: 1,
      //   distanceFilter: 1,
      //   debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      //   stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      //   interval: 1000,
      //   fastestInterval: 1000,
      //   activitiesInterval: 1000,
      //   notificationsEnabled: true,
      //   notificationTitle: 'Please wait...',
      //   notificationText: 'HK ABSEN Tracking',// startForeground: true
      // };

      // this.backgroundGeolocation.configure(config)
      //   .then((tes) => {
      //     this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
      //       this.ReadGeocode(location.latitude, location.longitude);
      //     });
      //   }, (err) => {
      //     console.log("eror didalam : " + JSON.stringify(err));
      //     // this.globalService.PresentAlert("eror didalam : " + JSON.stringify(err));
      //   }).catch((error) => {
      //     console.log("eror diluar : " + JSON.stringify(error));
      //     // this.globalService.PresentAlert("eror diluar : " + JSON.stringify(error));
      //   });

      window.app = this;
    });

    // this.authenticationService.authenticationState.subscribe(state => {
    //   if (state) {
    //     this.router.navigate(['home']);
    //   } else {
    //     this.router.navigate(['']);
    //   }
    // });

    this.platform.backButton.subscribe(() => {
      // navigator['app'].appMinimize.minimize();
      this.appMinimize.minimize();

    });

    // this.fcm.onNotification().subscribe(data => {
    //   console.log(data);
    //   if (data.wasTapped) {
    //     console.log('Received in background');
    //     this.router.navigate([data.landing_page, data.price]);
    //   } else {
    //     console.log('Received in foreground');
    //     this.router.navigate([data.landing_page, data.price]);
    //   }
    // });
    // this.cobadeh = "bisaga";
    // this.fcm.subscribeToTopic(this.cobadeh);
  }

  // private ReadGeocode(latitude: number, longitude: number) {
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       if (this.platform.is('ios'))
  //         this.MappingLocationGeocode(0, result);
  //       else
  //         this.MappingLocationGeocode(1, result);
  //     })
  //     .catch((error: any) => {
  //       this.backgroundGeolocation.stop();
  //       this.backgroundGeolocation.finish(); // FOR IOS ONLY
  //       this.globalService.PresentAlert("eror read: " + error.toString());
  //       console.log(error);
  //     });
  // }

  // private MappingLocationGeocode(index: number, result: NativeGeocoderResult[]) {
  //   var thoroughfare = result[index].thoroughfare;
  //   var subThoroughfare = result[index].subThoroughfare;
  //   var subLocality = result[index].subLocality ? ", " + result[index].subLocality : "";
  //   var locality = result[index].locality ? ", " + result[index].locality : "";
  //   var subAdministrativeArea = result[index].subAdministrativeArea ? ", " + result[index].subAdministrativeArea : "";
  //   var administrativeArea = result[index].administrativeArea ? ", " + result[index].administrativeArea : "";
  //   var postalCode = result[index].postalCode ? " " + result[index].postalCode : "";
  //   var locationGeocode = thoroughfare + subThoroughfare + subLocality + locality + subAdministrativeArea + administrativeArea + postalCode;

  //   this.MappingLocationData(locationGeocode);
  // }

  // private MappingLocationData(locationGeocode: string) {
  //   var trackingData = new TrackingData();

  //   if (this.counter > 2) {
  //     var dateData = this.globalService.GetDate();
  //     trackingData.scheduleKe = this.counter.toString();
  //     trackingData.dateSch = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
  //     trackingData.timeSch = dateData.szHour + ":" + dateData.szMinute;
  //     trackingData.lokasiSch = locationGeocode;
  //   } else if (this.counter > 1) {
  //     var dateData = this.globalService.GetDate();
  //     trackingData.scheduleKe = this.counter.toString();
  //     trackingData.dateSch = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
  //     trackingData.timeSch = dateData.szHour + ":" + dateData.szMinute;
  //     trackingData.lokasiSch = locationGeocode;
  //   } else {
  //     var dateData = this.globalService.GetDate();
  //     trackingData.scheduleKe = this.counter.toString();
  //     trackingData.dateSch = this.datePipe.transform(dateData.date, 'yyyy-MM-dd');
  //     trackingData.timeSch = dateData.szHour + ":" + dateData.szMinute;
  //     trackingData.lokasiSch = locationGeocode;
  //   }

  //   var data = this.globalService.SetTracking(trackingData);
  //   this.SubscribeSetTracking(data);

  //   // // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
  //   // // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
  //   // // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
  //   this.backgroundGeolocation.stop();
  //   this.backgroundGeolocation.finish(); // FOR IOS ONLY
  // }

  // private async SubscribeSetTracking(data: Observable<any>) {
  //   data.subscribe(data => {
  //     if (data.response == "success" && this.counter >= 3) this.counter = 1;
  //     else this.counter += 1;
  //   });
  // }

  async InitializeData() {
    await this.globalService.GetUserDataFromStorage();
    this.globalService.GetOfficeHour();
    this.globalService.GetActivityData();
    this.globalService.GetHolidayDataList();
    this.globalService.GetDateCategoryDataList();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      this.appMinimize.minimize();
      // navigator['app'].appMinimize.minimize();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}