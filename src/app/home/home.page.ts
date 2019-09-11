import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  datas: any = [];
  geoLatitude: number;
  geoLongitude: number;
  lat: number;
  long: number;
  waktu: string;
  public txtTimeNow: string;
  public txtDayNow: string;
  public inputVal: string = "variabel";
  public txtTimeArrived: string = "07:48 AM";
  public txtTimeBack: string = "-";
  public txtWorkStatus: string = "Working";
  geoAccuracy:number;

  constructor(public navCtrl: NavController, 
    public alertController: AlertController,
    public router: Router,
    private geolocation: Geolocation
    ) { }

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

    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = 11;
      this.geoLongitude = 0; 
      this.geoAccuracy = resp.coords.accuracy; 
      // this.getGeoencoder(this.geoLatitude,this.geoLongitude);
     }).catch((error) => {
     });
  }

  buttonAbsen() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var hours= today.getHours();
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    this.waktu = time;

    
  
    this.geolocation.getCurrentPosition(options).then((position) => {
      this.geoLatitude = position.coords.latitude;
      this.geoLongitude = position.coords.longitude; 
      this.geoAccuracy = position.coords.accuracy; 
      // this.getGeoencoder(this.geoLatitude,this.geoLongitude);
     }).catch((error) => {
       alert('GPS ANDA BELUM AKTIF');
     });

     if(this.geoLatitude=0){
       this.geoLatitude = 0;
       this.geoLongitude = 11;
     }
    
     if( this.geoLatitude <= -6.24508 && this.geoLatitude >= -6.24587 && this.geoLongitude >= 106.87269 && this.geoLongitude <= 106.87379 ){
      if (hours >=6 && hours <=17 ) {
        alert("ABSEN DATANG DITERIMA");
      } else if (hours > 17){ 
        alert("ABSEN PULANG");
      }
     }else{
      alert("DILUAR LOKASI ABSEN");
     }

  }

  // doRefresh(event) {
  //   console.log('Begin async operation');

  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     event.target.complete();
  //   }, 2000);
  // }

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
