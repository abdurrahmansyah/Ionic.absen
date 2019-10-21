import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InjectorInstance } from '../app.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public requestDatas = [];
  public timeArrived: string = "";
  public timeReturn: string = "";
  httpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor() { }

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

  public GetRequestDatasByUserId(szUserId: string, dateRequest: string) {
    this.requestDatas = [];
    this.timeReturn = "";
    this.timeArrived = "";
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetRequestDatas.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('dateRequest', dateRequest);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        this.requestDatas = data.result;
        this.timeArrived = data.user.timevalidarrived;
        this.timeReturn = data.user.timevalidreturn;
      }
      else {
        this.requestDatas = [];
      }
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
  public szUserId: string;
  public szUserName: string;
  public dtmRequest: Date;
  public szactivityid: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public szStatusId: string;
  public szStatusName: string;
  public decTotal: number;
  public szSuperiorUserId: string; // cek dipakek bener ga
  public szSuperiorUserName: string; // cek dipakek bener ga
  public timeArrived: string; // cek dipakek bener ga
  public timeBack: string; // cek dipakek bener ga
}

export class ActivityId {
  public static readonly AC001: string = "AC001"; //ON TIME 
  public static readonly AC002: string = "AC002"; //TERLAMBAT
  public static readonly AC003: string = "AC003"; //DILUAR KANTOR
  public static readonly AC004: string = "AC004"; //PULANG CEPAT
  public static readonly AC005: string = "AC005"; //LEMBUR
  public static readonly AC006: string = "AC006"; //ABSEN
}

export class StatusId {
  public static readonly ST001: string = "ST001"; //APPROVED
  public static readonly ST002: string = "ST002"; //NOT APPROVED 
  public static readonly ST003: string = "ST003"; //NEED APPROVAL 
}