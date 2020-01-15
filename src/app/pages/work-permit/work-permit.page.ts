import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-work-permit',
  templateUrl: './work-permit.page.html',
  styleUrls: ['./work-permit.page.scss'],
})
export class WorkPermitPage implements OnInit {

  constructor(private globalService: GlobalService, private alertController: AlertController) {

    this.PresentAlert("Fungsi ini dapat diakses menggunakan aplikasi Success Factor")
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
          window.open("https://performancemanager10.successfactors.com/login?company=pthutamaka&username=" + this.globalService.userData.szUserId, '_system', 'location=yes');
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

}
