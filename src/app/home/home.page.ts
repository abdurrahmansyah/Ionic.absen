//import { Component } from '@angular/core';
//import { NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { AuthenticationService } from './../services/authentication.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  timeDatas: any = [];
  geoLatitude: number;
  geoLongitude: number;
  lat: number;
  long: number;
  waktu: string;
  public txtTimeNow: string;
  public txtDayNow: string;
  public inputVal: string = "variabel";
  public txtTimeArrived: string ;
  public txtDate: string ;
  public txtTimeBack: string = "";
  public txtWorkStatus: string ="";
  geoAccuracy: number;
  nik: any;
  kehadiran: any;
  warnaStatus: string;
  public buttonPropertyDatas = [];
  error: void;

  constructor(public navCtrl: NavController, public alertController: AlertController,
    public router: Router,
    public geolocation: Geolocation,
    public http: HttpClient,
    private storage: Storage,
    public popoverController: PopoverController,
    private authService: AuthenticationService
  ) {

    this.storage.get('username').then((nik) => {
      this.nik = nik;
      let Data:Observable<any>;
      var url = 'http://sihk.hutamakarya.com/apiabsen/transaksi.php';
      var url2 = url+"?user_nik="+this.nik;
      Data = this.http.get(url2); //+"?usernik="+this.nik
      Data.subscribe( hasil => {
        this.kehadiran = hasil;
        if (this.kehadiran.error == false) {
          this.txtTimeArrived = this.kehadiran.user.jam_datang_valid; //get api read ;
        }else{
          this.txtTimeArrived = "";
        } 
        this.statusWork();
      });
    });

    this.starTimer();
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    var dateData = this.GetDate();

    this.txtDayNow = dateData.day + ", " + dateData.date + " " + dateData.month + " " + dateData.year;
    this.txtTimeNow = this.checkTime(dateData.hr) + ":" + this.checkTime(dateData.minute) + ":"  + this.checkTime(dateData.sec) + " " + dateData.ampm;

    // this.txtTimeNow = dateData.hrString + ":" + dateData.minuteString + " " + dateData.ampm;
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  starTimer() {
    this.newMethod();
  }

  statusWork(){
    if (!this.txtTimeArrived) {
      this.txtWorkStatus = "Not Working" ;
      this.warnaStatus = "danger"; 
    }
    else{
      this.txtWorkStatus = "Working" ;
      this.warnaStatus = "primary";
    }
  }

  private newMethod() {
    setInterval(function () {
      this.ngOnInit();
    }.bind(this), 500);
  }

  private GetDate(): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date();

    dateData.day = days[date.getDay()];
    dateData.date = date.getDate();
    dateData.month = months[date.getMonth()];
    dateData.year = date.getFullYear();
    dateData.month2 = date.getMonth();
    dateData.minute = date.getMinutes();
    dateData.sec = date.getSeconds();
    dateData.minuteString = dateData.minute.toString();
    if (dateData.minute < 10) {
      dateData.minuteString = "0" + dateData.minute;
    }
    dateData.hr = date.getHours();
    var hr = dateData.hr;
    dateData.ampm = "AM";
    if (dateData.hr > 12) {
      hr -= 12;
      dateData.ampm = "PM";
    }
    dateData.hrString = hr.toString();
    if (hr < 10) {
      dateData.hrString = "0" + hr;
    }

    return dateData;
  }

  async buttonAbsen() {
    var dateData = this.GetDate();
    
    if (!this.txtTimeArrived) {
      this.txtTimeArrived = dateData.hrString + ":" + dateData.minuteString + " " + dateData.ampm;
      this.txtDate = dateData.year+"/"+dateData.month2+"/"+dateData.day;

    } else if (!this.txtTimeBack) {
      this.txtTimeBack = dateData.hrString + ":" + dateData.minuteString + " " + dateData.ampm;
    } else {
      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: 'Subtitle',
        message: 'This is an alert message.',
        cssClass: 'alertcss',
        buttons: ['OK', 'Cancel'],
        mode: "ios"
      });

      // alert.style.cssText = "color: ";
      await alert.present();
    }

    // UNCOMMEND
    // this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((position) => {
    //   this.geoLatitude = position.coords.latitude;
    //   this.geoLongitude = position.coords.longitude;
    //   this.geoAccuracy = position.coords.accuracy;
    //   // this.getGeoencoder(this.geoLatitude,this.geoLongitude);
    // }).catch((error) => {
    //   alert('GPS ANDA BELUM AKTIF');
    // });

    // if (this.geoLatitude = 0) {
    //   this.geoLatitude = 0;
    //   this.geoLongitude = 11;
    // }

    // var hours = dateData.hr;
    // if (this.geoLatitude <= -6.24508 && this.geoLatitude >= -6.24587 && this.geoLongitude >= 106.87269 && this.geoLongitude <= 106.87379) {
    //   if (hours >= 6 && hours <= 17) {
    //   } else if (hours > 17) {
    //     this.popoverController;
    //   }
    // } else {
    //   alert("DILUAR LOKASI ABSEN");
    //   this.presentPopover(1);
    //  }

  }
  absenhadir() {
    // throw new Error("Method not implemented.");
    var tanggal = this.txtDate;
    var jamdatang= this.txtTimeArrived;


  }

  navigateToReportPage() {
    this.router.navigate(['reports'])
  }

  navigateToNotificationsPage() {
    this.router.navigate(['notifications'])
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'pop-over-style'
    });

    popover.style.cssText = '--min-width: 300px; --box-shadow: #15ff00';
    return await popover.present();
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

class DateData {
  public day: string;
  public date: number;
  public month: string;
  public year: number;
  public hr: number;
  public hrString: string;
  public minute: number;
  public minuteString: string;
  public ampm: string;
  public sec: number;
  month2: number;

  constructor() { }
}