import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  datas: any = [];
  public txtTimeNow: Date;
  public txtDayNow: string;
  public inputVal: string = "variabel";
  public txtTimeArrived: string = "07:48 AM";
  public txtTimeBack: string = "-";
  public txtWorkStatus: string = "Working";
  constructor(public navCtrl: NavController, public alertController: AlertController) { }

  ngOnInit() {
  }

  clickedButton() {
    console.log("Time");
  }

  buttonAbsen() {
    alert("ABSEN SELESAI");
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      cssClass: 'alertcss',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'background',
          handler: (blah) => {
            console.log('Confirm Cancel: blah'); 
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  doAbsen(){
    var date = new Date();
    console.log(date.toLocaleDateString("DDDD"));
    console.log(date.toString());
    console.log(date.toDateString());
    this.txtDayNow = date.toDateString();
    this.txtTimeNow = date;
  }
}
