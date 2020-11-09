import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

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
  private versionNumber: string;

  constructor(private router: Router, 
    private platform: Platform, 
    private appVersion: AppVersion, 
    private globalService: GlobalService) {
    this.GetVersion();
  }

  GetVersion() {
    this.appVersion.getVersionNumber().then((versionNumber) => {
      this.versionNumber = versionNumber;
    }).catch((error) => {
      this.globalService.PresentAlert(error.message);
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  navigateToLoginPage() {
    this.router.navigate(['login']);
  }
}
