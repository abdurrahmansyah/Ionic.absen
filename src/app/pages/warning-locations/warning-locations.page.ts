import { Component, OnInit } from '@angular/core';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-warning-locations',
  templateUrl: './warning-locations.page.html',
  styleUrls: ['./warning-locations.page.scss'],
})
export class WarningLocationsPage implements OnInit {

  constructor(private openNativeSettings: OpenNativeSettings,
    private diagnostic: Diagnostic,
    private router: Router,
    private alertController: AlertController) {
    this.CheckIsLocationAvailable();
    this.Timer();
  }

  private CheckIsLocationAvailable() {
    this.diagnostic.isLocationAvailable().then((allowed) => {
      if (allowed) {
        this.router.navigate(['home']);
      }
    }).catch((e) => {
      this.alertController.create({
        mode: 'ios',
        message: e.message,
        buttons: ['OK']
      }).then(alert => {
        return alert.present();
      });
    });
  }

  private Timer() {
    setInterval(function () {
      this.CheckIsLocationAvailable();
    }.bind(this), 1000);
  }

  ngOnInit() {
  }

  public OpenSettings() {
    this.openNativeSettings.open("settings");
  }
}
