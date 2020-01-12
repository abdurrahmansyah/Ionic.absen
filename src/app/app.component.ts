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
import { GlobalService } from './services/global.service';



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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private authenticationService: AuthenticationService,
    private router: Router,
    private fcm: FCM,
    private globalService: GlobalService
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

  async InitializeData() {
    await this.globalService.GetUserDataFromStorage();
    this.globalService.GetOfficeHour();
    this.globalService.GetActivityData();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
