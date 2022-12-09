import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { Storage } from '@ionic/storage';
import { WELCOME_KEY } from 'src/app/guards/welcome.guard';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  private subscription: any;
  public versionNumber: string;

  constructor(private router: Router,
    private platform: Platform,
    private appVersion: AppVersion,
    private globalService: GlobalService,
    private storage: Storage) {
  }

  ngOnInit() { }

  ionViewWillEnter() {
    setTimeout(() => {
      this.GetVersion();
    }, 100);
  }

  // ionViewDidEnter() {
  //   this.subscription = this.platform.backButton.subscribe(() => {
  //     navigator['app'].exitApp();
  //   });
  // }

  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }

  GetVersion() {
    this.appVersion.getVersionNumber().then((versionNumber) => {
      this.versionNumber = versionNumber;
    }).catch((error) => {
      this.globalService.PresentAlert(error == "cordova_not_available" ? "Gagal cek versi aplikasi" : error);
    });
  }

  navigateToLoginPage() {
    this.storage.set(WELCOME_KEY, 'true');
    this.router.navigateByUrl('index/login', { replaceUrl: true });
  }
}
