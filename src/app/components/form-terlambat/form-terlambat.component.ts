import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-terlambat',
  templateUrl: './form-terlambat.component.html',
  styleUrls: ['./form-terlambat.component.scss'],
})
export class FormTerlambatComponent implements OnInit {
  public result: any;
  public txtTimeNow: string;
  data: Observable<any>;
  timeArrived: string;
  szDesc: string;
  szUserId: string;
  kehadiran: any;
  timeArived: string;
  txtDate: string;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public http: HttpClient,
    private storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController,
  ) { 
    this.GetStorage();
    this.Timer();
  }

  ngOnInit() {
    var dateData = this.GetDate();
    this.txtTimeNow = this.CheckTime(dateData.decHour) + ":" + this.CheckTime(dateData.decMinute) + ":" + this.CheckTime(dateData.decSec) + " " + dateData.szAMPM;
  }

  private CheckTime(i: any) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  private Timer() {
    setInterval(function () {
      this.ngOnInit();
    }.bind(this), 500);
  }

  async GetStorage() {
    //Fungsi untuk mengambil value pada local storage
    await this.storage.get('szUserId').then((szUserId) => {
      this.szUserId = szUserId;
    });
  }
  
  private GetDate(): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date();

    dateData.decYear = date.getFullYear();
    dateData.decMonth = months[date.getMonth()];
    dateData.decMonth2 = date.getMonth() + 1;
    dateData.decDate = date.getDate();
    dateData.szDay = days[date.getDay()];
    dateData.decMinute = date.getMinutes();
    dateData.szMinute = dateData.decMinute < 10 ? "0" + dateData.decMinute : dateData.decMinute.toString();
    dateData.decHour = date.getHours();
    dateData.szHour = dateData.decHour < 10 ? "0" + dateData.decHour : dateData.decHour.toString();
    dateData.decSec = date.getSeconds();
    dateData.szAMPM = dateData.decHour > 12 ? "PM" : "AM";

    return dateData;
  }

  submitLate() {
    this.submitTimeArrived();
  }

  submitTimeArrived(){
    var dateData = this.GetDate();
    this.timeArived = dateData.decHour + ":" + dateData.szMinute + ":" + dateData.decSec;
    var jamdatang = this.timeArived;
    var jamplg = "00:00:00";
    var url = 'http://sihk.hutamakarya.com/apiabsen/absendatang.php';
   
    var nik = this.szUserId;
    
    let postdata = new FormData();
    postdata.append('szUserId', nik);
    postdata.append('jamdt', jamdatang);
    postdata.append('jamdtvld', jamdatang);
    postdata.append('jamplg', jamplg);
    postdata.append('jamplgvld', jamplg);

    var data: Observable<any> = this.http.post(url, postdata);
    data.subscribe(hasil => {
      this.kehadiran = hasil;
    });
    this.submitRequestLate();
  }

  submitRequestLate(){
    var dateData = this.GetDate();
    this.timeArived = dateData.decHour + ":" + dateData.szMinute + ":" + dateData.decSec;
    this.txtDate = dateData.decYear + "/" + dateData.decMonth2 + "/" + dateData.decDate;
    
    var ActivityId = "AC002";
    var StatusId = "ST002";
    var url = 'http://sihk.hutamakarya.com/apiabsen/formrequest.php';
    var nik = this.szUserId;
    var szRequestId = "HK_" + this.txtDate + "_" +  nik;
    var szId = "HK_" + this.txtDate + "_" + ActivityId + "_" + nik; 
    var dtmReq = this.txtDate + " " + this.timeArived;
    console.log(nik);
    
    let postdata = new FormData();
    postdata.append('szUserId', nik);
    postdata.append('dtmRequest', dtmReq);
    postdata.append('szActivityId', ActivityId);
    postdata.append('szDesc', this.szDesc);
    postdata.append('szStatusId',StatusId );
    postdata.append('szRequestId',szRequestId );
    postdata.append('szId',szId );

    var data: Observable<any> = this.http.post(url, postdata);
    data.subscribe(hasil => {
      this.kehadiran = hasil;
    });
    this.router.navigate(['home']);  
  }
}

class DateData {
  public szDay: string;
  public decDate: number;
  public decMonth: string;
  public decYear: number;
  public decHour: number;
  public szHour: string;
  public decMinute: number;
  public szMinute: string;
  public szAMPM: string;
  public decSec: number;
  decMonth2: number;
  day2: number;
  static decHour: string;
  static szMinute: string;
  static decSec: string;

  constructor() { }
}