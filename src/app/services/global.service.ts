import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InjectorInstance } from '../app.module';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public requestDatas = [];
  public timeArrived: string = "";
  public timeReturn: string = "";
  httpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor(private router: Router,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private storage: Storage) { }

  public GetDate(): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date();

    dateData.date = date;
    dateData.decYear = date.getFullYear();
    dateData.szMonth = months[date.getMonth()];
    dateData.decMonth = date.getMonth() + 1;
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

  public GetUserData(szUserId: string, szPassword: string) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetUserData.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('szPassword', szPassword);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        this.storage.set('userData', data.result.find(x => x));

        this.PresentToast("Login Berhasil");
        this.authService.login();
        this.router.navigate(['home']);
      }
      else {
        this.PresentToast("Login Gagal");
      }
    });
  }

  public SaveReportData(reportData: ReportData) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/SaveReportData.php';
    let postdata = new FormData();
    postdata.append('szUserId', reportData.szUserId);
    postdata.append('dateAbsen', reportData.dateAbsen);
    postdata.append('timeArrived', reportData.timeArrived);
    postdata.append('timeValidArrived', reportData.timeArrived);
    postdata.append('timeReturn', reportData.timeReturn);
    postdata.append('timeValidReturn', reportData.timeReturn);

    var data: Observable<any> = this.httpClient.post(url, postdata);
    data.subscribe(reportDatas => { });
  }

  public GetReportData(szUserId: string, dateAbsen: string) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetReportData.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('dateAbsen', dateAbsen);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(reportDatas => {
      if (reportDatas.error == false) {
        var timeValidArrived = reportDatas.user.timeValidArrived.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.timeArrived = hour + ":" + minute + " " + ampm;
        var timeValidBack = reportDatas.user.timeValidReturn.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidBack);
        this.timeReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;
      }
      else {
        this.timeArrived = "";
        this.timeReturn = "";
      }
    });
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[2] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  public GetRequestDatasByUserId(szUserId: string, dateRequest: string) {
    this.requestDatas = [];
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetRequestDatas.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('dateRequest', dateRequest);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) { this.requestDatas = data.result; }
    });
  }

  public GetRequestDatasForNotifications(szUserId: string) {
    this.requestDatas = [];
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetRequestDatasForNotifications.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        this.requestDatas = data.result;
      }
      else {
        this.requestDatas = [];
      }
    });
  }

  SaveRequest(requestData: RequestData, dateData: DateData) {
    var date = dateData.decYear + "/" + dateData.decMonth + "/" + dateData.decDate;

    var url = 'http://sihk.hutamakarya.com/apiabsen/SaveRequestData.php';
    requestData.szRequestId = "HK_" + dateData.date.toLocaleDateString() + "_" + requestData.szactivityid + "_" + requestData.szUserId;
    requestData.dateRequest = dateData.date.toLocaleString();
    console.log(dateData.date.toLocaleDateString());

    let postdata = new FormData();
    postdata.append('szRequestId', requestData.szRequestId);
    postdata.append('szUserId', requestData.szUserId);
    postdata.append('dateRequest', requestData.dateRequest);
    postdata.append('szActivityId', requestData.szactivityid);
    postdata.append('szDesc', requestData.szDesc);
    postdata.append('szLocation', requestData.szLocation);
    postdata.append('szStatusId', requestData.szStatusId);
    postdata.append('decTotal', requestData.decTotal);
    postdata.append('dtmCreated', requestData.dateRequest);
    postdata.append('dtmLastUpdated', requestData.dateRequest);

    var data: Observable<any> = this.httpClient.post(url, postdata);
    data.subscribe(hasil => { });
    this.PresentToast(requestData.szactivityid == ActivityId.AC002 ? "Berhasil mengajukan izin terlambat" :
      "");
    this.router.navigate(['home']);
  }

  async PresentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }
}

export class DateData {
  public date: Date;
  public szDay: string;
  public decDate: number;
  public szMonth: string;
  public decYear: number;
  public decHour: number;
  public szHour: string;
  public decMinute: number;
  public szMinute: string;
  public szAMPM: string;
  public decSec: number;
  decMonth: number;
  day2: number;

  constructor() { }
}

export class ReportData {
  public szUserId: string;
  public szUserName: string;
  public dateAbsen: string;
  public timeArrived: string;
  public timeValidArrived: string;
  public timeReturn: string = "00:00:00";
  public timeValidReturn: string;
}

export class RequestData {
  public szRequestId: string;
  public szUserId: string;
  public szUserName: string;
  public dateRequest: string;
  public szactivityid: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public szStatusId: string;
  public szStatusName: string;
  public decTotal: string;
  public szSuperiorUserId: string; // cek dipakek bener ga
  public szSuperiorUserName: string; // cek dipakek bener ga
  public timeArrived: string; // cek dipakek bener ga
  public timeBack: string; // cek dipakek bener ga
}

export class ActivityId {
  public static readonly AC001: string = "AC001"; //On Time
  public static readonly AC002: string = "AC002"; //Terlambat
  public static readonly AC003: string = "AC003"; //Datang Diluar Kantor
  public static readonly AC004: string = "AC004"; //Pulang Diluar Kantor
  public static readonly AC005: string = "AC005"; //Pulang Cepat
  public static readonly AC006: string = "AC006"; //Lembur
  public static readonly AC007: string = "AC007"; //Absen
  public static readonly AC008: string = "AC008"; //Sakit
  public static readonly AC009: string = "AC009"; //Izin
  public static readonly AC010: string = "AC010"; //Cuti
}

export class StatusId {
  public static readonly ST001: string = "ST001"; //Approved
  public static readonly ST002: string = "ST002"; //Not Approved 
  public static readonly ST003: string = "ST003"; //Need Approval 
}