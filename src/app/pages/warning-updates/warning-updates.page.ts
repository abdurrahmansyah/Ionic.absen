import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Market } from '@ionic-native/market/ngx';
import { GlobalService } from 'src/app/services/global.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warning-updates',
  templateUrl: './warning-updates.page.html',
  styleUrls: ['./warning-updates.page.scss'],
})
export class WarningUpdatesPage implements OnInit {

  constructor(private platform: Platform,
    private market: Market,
    private globalService: GlobalService,
    private appVersion: AppVersion,
    public router: Router) {
    this.CheckIsApplicationUpdated();
    this.Timer();
  }

  private CheckIsApplicationUpdated() {
    var data = this.globalService.GetVersionNumber();
    data.subscribe(data => {
      if (data.response == "success") {
        var versionNumberDb = data.data;

        this.appVersion.getVersionNumber().then((versionNumber) => {
          if (versionNumber == versionNumberDb)
            this.router.navigate(['home']);
        }).catch((error) => {
          this.globalService.PresentAlert(error.message);
        });
      }
    });
  }

  private Timer() {
    setInterval(function () {
      this.CheckIsApplicationUpdated();
    }.bind(this), 500);
  }

  ngOnInit() {
  }

  public UpdateApps() {
    if (this.platform.is('android'))
      this.market.open('com.hutamakarya.hkabsen');
    else if (this.platform.is('ios'))
      this.market.open('id1491468614');
  }
}
