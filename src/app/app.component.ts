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
  arr: any;
  kota: any;
  provinsi: any;
  location: any;

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
    private nativeGeocoder: NativeGeocoder
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
      var id: number = 1;

      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 0,
        distanceFilter: 0,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        interval: 5000,
        // fastestInterval: 60000,
        // activitiesInterval: 60000,
      };

      this.backgroundGeolocation.configure(config)
        .then((tes) => {
          // this.globalService.PresentAlert("sebelumnya : " + id++);
          // this.globalService.PresentAlert("ini tes : " + JSON.stringify(tes));
          this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
            // this.PresentAlert("masuk : " + id++);
            var locationData = new LocationData();
            var date = new Date();
            this.ReadGeocode(location.latitude, location.longitude);

            locationData.id = location.id;
            locationData.accuracy = location.accuracy.toString()
            locationData.location = this.location;
            locationData.provider = location.provider;
            locationData.time = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();

            var locationstr = localStorage.getItem("location");
            if (locationstr == null) {
              this.arr.push(locationData);
            } else {
              var locationarr = JSON.parse(locationstr);
              this.arr = locationarr;
              this.arr.push(locationData);
            }
            this.globalService.PresentAlert("ISI ARR: " + JSON.stringify(this.arr));
            localStorage.setItem("location", JSON.stringify(this.arr));
            // this.globalService.pushNotif("location", JSON.stringify(location));

            // this.backgroundGeolocation.start();

            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            // this.backgroundGeolocation.finish(); // FOR IOS ONLY
          });
        }, (err) => {
          this.globalService.PresentAlert("eror didalam : " + JSON.stringify(err));
        }).catch((error) => {
          this.globalService.PresentAlert("eror diluar : " + JSON.stringify(error));
        });

      // window.app = this;
    });

    this.authenticationService.authenticationState.subscribe(state => {
      if (state) {
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['']);
      }
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
      })
      .catch((error: any) => console.log(error));
  }

  private MappingLocationGeocode(index: number, result: NativeGeocoderResult[]) {
    var thoroughfare = result[index].thoroughfare;
    var subThoroughfare = result[index].subThoroughfare;
    var subLocality = result[index].subLocality ? ", " + result[index].subLocality : "";
    var locality = result[index].locality ? ", " + result[index].locality : "";
    var subAdministrativeArea = result[index].subAdministrativeArea ? ", " + result[index].subAdministrativeArea : "";
    var administrativeArea = result[index].administrativeArea ? ", " + result[index].administrativeArea : "";
    var postalCode = result[index].postalCode ? " " + result[index].postalCode : "";
    this.kota = result[index].subAdministrativeArea;
    this.provinsi = result[index].administrativeArea;
    this.location = thoroughfare + subThoroughfare + subLocality + locality + subAdministrativeArea + administrativeArea + postalCode;
  }

  async InitializeData() {
    await this.globalService.GetUserDataFromStorage();
    this.globalService.GetOfficeHour();
    this.globalService.GetActivityData();




    // start recording location
    this.backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}