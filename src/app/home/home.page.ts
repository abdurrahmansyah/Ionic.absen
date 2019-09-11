import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  datas: any = [];
  public txtTimeNow: string;
  public txtDayNow: string;
  public inputVal: string = "variabel";
  public txtTimeArrived: string = "07:48 AM";
  public txtTimeBack: string = "-";
  public txtWorkStatus: string = "Working";
  constructor(public navCtrl: NavController, 
    public alertController: AlertController,
    public router: Router) { }

  ngOnInit() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    var date = new Date();
    var hr = date.getHours();
    var ampm = "AM";
    if (hr > 12) {
      hr -= 12;
      ampm = "PM";
    }
    var day = days[date.getDay()];
    var tanggal = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();

    var minute = date.getMinutes();
    var minuteString = minute.toString();
    if (minute < 10){
      minuteString = "0" + minute;
    }
    this.txtDayNow = day + ", " + tanggal + " " + month + " " + year;
    this.txtTimeNow = date.getHours() + ":" + minuteString + " " + ampm;
  }

  buttonAbsen() {
    alert("ABSEN SELESAI");

    
  }

  clickedButton(){
    this.router.navigate(['notifications'])
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
}
