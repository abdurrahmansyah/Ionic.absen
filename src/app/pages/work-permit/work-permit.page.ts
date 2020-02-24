import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-work-permit',
  templateUrl: './work-permit.page.html',
  styleUrls: ['./work-permit.page.scss'],
})
export class WorkPermitPage implements OnInit {

  constructor(private globalService: GlobalService, private alertController: AlertController, private inAppBrowser: InAppBrowser) {

    this.PresentAlert("Fungsi ini dapat diakses menggunakan aplikasi HITS")
    // this.globalService.PresentAlert("Fungsi ini dapat diakses menggunakan aplikasi Success Factor")
  }

  ngOnInit() {
  }

  PresentAlert(msg: string) {
    console.log("deletable");
    
    this.alertController.create({
      mode: 'ios',
      message: msg,
      buttons: [{
        text: "Back",
      }, {
        text: "Open",
        handler: () => {
          this.inAppBrowser.create("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId);
          // window.open("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId, '_system', 'location=yes');
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

}
