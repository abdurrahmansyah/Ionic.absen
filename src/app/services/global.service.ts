import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InjectorInstance } from '../app.module';
import { Observable } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public requestDatas = [];
  public summaryReportDatas = [];
  public errorDatas = [];
  public timeArrived: string = "";
  public timeReturn: string = "";
  public timeRequest: string = "";
  public dateRequest: string = "";
  public isArrived: boolean = true;
  public userData: UserData = new UserData();
  public geoLatitude: number;
  public geoLongitude: number;

  httpClient = InjectorInstance.get<HttpClient>(HttpClient);
  dataimage: any;

  constructor(private router: Router,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private alertController: AlertController,
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

  public GetDateWithDateParam(dateParam): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date(dateParam);

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

  public async GetUserDataFromStorage() {
    await this.storage.get('userData').then((userData) => {
      this.userData = userData;
    });
  }

  public GetUserData(szUserId: string, szPassword: string) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetUserData.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('szPassword', szPassword);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        var userDataFromDb = data.result.find(x => x);
        var userData = this.MappingUserData(userDataFromDb);

        this.storage.set('userData', userData);
        this.PresentToast("Login Berhasil");
        this.authService.login();
        this.router.navigate(['home']);
      }
      else {
        this.PresentToast("Login Gagal");
      }
    });
  }

  private MappingUserData(userDataFromDb: any) {
    var userData = new UserData();
    userData.szUserId = userDataFromDb.szuserid;
    userData.szPassword = userDataFromDb.szpassword;
    userData.szFullName = userDataFromDb.szfullname;
    userData.szShortName = userDataFromDb.szshortname;
    userData.szTitleId = userDataFromDb.sztitleid;
    userData.szTitleName = userDataFromDb.sztitlename;
    userData.szDivisionId = userDataFromDb.szdivisionid;
    userData.szDivisionName = userDataFromDb.szdivisionname;
    userData.szSectionId = userDataFromDb.szsectionid;
    userData.szSectionName = userDataFromDb.szsectionname;
    userData.bStatusAdmin = userDataFromDb.bstatusadmin;
    userData.szImage = userDataFromDb.szimage;
    userData.szEmail = userDataFromDb.szemail;
    userData.szSuperiorUserId = userDataFromDb.szsuperioruserid;
    userData.szSuperiorUserName = userDataFromDb.szsuperiorusername;
    return userData;
  }

  public SaveReportData(reportData: ReportData): Observable<any> {
    var url = 'http://sihk.hutamakarya.com/apiabsen/SaveReportData.php';
    let postdata = new FormData();
    postdata.append('szUserId', reportData.szUserId);
    postdata.append('dateAbsen', reportData.dateAbsen);
    postdata.append('timeArrived', reportData.timeArrived);
    postdata.append('timeValidArrived', reportData.timeArrived);
    postdata.append('timeReturn', reportData.timeReturn);
    postdata.append('timeValidReturn', reportData.timeReturn);

    return this.httpClient.post(url, postdata);
  }

  public GetReportData(szUserId: string, dateAbsen: string) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetReportDatas.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('dateStart', dateAbsen);
    postdata.append('dateEnd', dateAbsen);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        var reportDataFromDb = data.result.find(x => x);
        var reportData = this.MappingReportData(reportDataFromDb);

        var timeValidArrived = reportData.timeValidArrived.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.timeArrived = hour + ":" + minute + " " + ampm;

        var timeValidBack = reportData.timeValidReturn.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidBack);
        this.timeReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;
      }
      else {
        this.timeArrived = "";
        this.timeReturn = "";
      }
    });
  }

  private MappingReportData(reportDataFromDb: any) {
    var reportData = new ReportData();
    reportData.szUserId = reportDataFromDb.szuserid;
    reportData.dateAbsen = reportDataFromDb.dateabsen;
    reportData.timeArrived = reportDataFromDb.timearrived;
    reportData.timeValidArrived = reportDataFromDb.timevalidarrived;
    reportData.timeReturn = reportDataFromDb.timereturn;
    reportData.timeValidReturn = reportDataFromDb.timevalidreturn;
    reportData.decMonth = reportDataFromDb.decmonth;

    return reportData;
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[2] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  public GetSummaryReportData(currentYear: string) {
    this.summaryReportDatas = [];
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetReportDatas.php';
    var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    let postdata = new FormData();
    postdata.append('szUserId', this.userData.szUserId);
    postdata.append('dateStart', '01/01/' + currentYear);
    postdata.append('dateEnd', '12/31/' + currentYear);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        var reportDatas = data.result;
        var decMonths = [...new Set(reportDatas.map(x => x.decmonth))];

        decMonths.forEach((x: number) => {
          var reportDatasPerMonth = reportDatas.filter(y => y.decmonth == x);

          var summaryReportData = new SummaryReportData();
          summaryReportData.szMonthAttendance = months[x - 1];
          summaryReportData.decTotalAttendance = [...new Set(reportDatasPerMonth.map(y => y.dateabsen))].length;
          summaryReportData.decTotalAbsen = 22 - summaryReportData.decTotalAttendance; // call fungsi bulan ini ada berapa hari
          summaryReportData.decTotalLate = reportDatasPerMonth.filter(y => y.szstatusid == "ST001" && y.szactivityid == "AC002").reduce((sum, current) => sum + +current.dectotal, 0);
          summaryReportData.decTotalBackEarly = reportDatasPerMonth.filter(y => y.szstatusid == "ST001" && y.szactivityid == "AC005").reduce((sum, current) => sum + +current.dectotal, 0);
          summaryReportData.decTotalOvertime = reportDatasPerMonth.filter(y => y.szstatusid == "ST001" && y.szactivityid == "AC006").reduce((sum, current) => sum + +current.dectotal, 0);
          this.summaryReportDatas.push(summaryReportData)
        });
      }
      else {
        console.log("Tidak ada yang dapat ditampilkan");
      }
    });
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

  public GetRequestDatasForNotifications() {
    this.requestDatas = [];
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetRequestDatasForNotifications.php';

    let postdata = new FormData();
    postdata.append('szUserId', this.userData.szUserId);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        this.MappingRequestDataForNotifications(data.result);
      }
      else {
        this.requestDatas = [];
        this.PresentAlert(data.error_msg);
        throw new Error(data.error_msg);
      }
    });
  }

  private MappingRequestDataForNotifications(data: any) {
    data.forEach(reqData => {
      var requestData = new RequestData();
      requestData.szRequestId = reqData.szrequestid;
      requestData.szUserId = reqData.szuserid;
      requestData.szUserName = reqData.szfullname;
      requestData.szDivisionId = reqData.szdivisionid;
      requestData.szSectionId = reqData.szsectionid;
      requestData.dateRequest = this.ReturnDate(reqData.daterequest);
      requestData.szActivityId = reqData.szactivityid;
      requestData.szActivityName = reqData.szactivityname;
      requestData.szDesc = reqData.szdesc;
      requestData.szLocation = reqData.szlocation;
      requestData.szStatusId = reqData.szstatusid;
      requestData.szStatusName = reqData.szstatusname;
      requestData.decTotal = this.ReturnTimeByTotal(reqData);
      requestData.szReasonImage = 'data:image/jpeg;base64,' + reqData.szreasonimage;
      requestData.bActiveRequest = true;
      this.requestDatas.push(requestData);
    });
  }

  private ReturnDate(daterequest: string): string {
    var dateData = this.GetDateWithDateParam(daterequest);

    return dateData.szDay + ", " + dateData.decDate + " " + dateData.szMonth + " " + dateData.decYear;
  }

  private ReturnTimeByTotal(reqData: any): string {
    if (reqData.szactivityid == ActivityId.AC002) {
      var decTotal = reqData.dectotal.split('.');
      var decHour = +decTotal[0] + 8;
      var decMinute = +decTotal[1] + 10;

      if (decMinute >= 60) {
        decMinute = decMinute - 60;
        decHour += 1;
      }

      return (decHour.toString().length < 2 ? "0" + decHour : decHour) + ":" + (decMinute.toString().length < 2 ? "0" + decMinute : decMinute);
    }
    else if (reqData.szactivityid == ActivityId.AC005) {
      var decTotal = reqData.dectotal.split('.');
      var decHour = 16 - +decTotal[0];
      var decMinute = 60 - +decTotal[1];

      return (decHour.toString().length < 2 ? "0" + decHour : decHour) + ":" + (decMinute.toString().length < 2 ? "0" + decMinute : decMinute);
    }
    else if (reqData.szactivityid == ActivityId.AC006) {
      var decTotal = reqData.dectotal.split('.');
      var decHour = +decTotal[0] + 17;
      var decMinute = +decTotal[1];

      return (decHour.toString().length < 2 ? "0" + decHour : decHour) + ":" + (decMinute.toString().length < 2 ? "0" + decMinute : decMinute);
    }
  }

  public SaveRequestData(requestData: RequestData) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/SaveRequestData.php';

    let postdata = new FormData();
    postdata.append('szUserId', requestData.szUserId);
    postdata.append('dateRequest', requestData.dateRequest);
    postdata.append('szActivityId', requestData.szActivityId);
    postdata.append('szDesc', requestData.szDesc);
    postdata.append('szLocation', requestData.szLocation);
    postdata.append('szStatusId', requestData.szStatusId);
    postdata.append('decTotal', requestData.decTotal);
    postdata.append('szReasonImage', requestData.szReasonImage);
    postdata.append('bActiveRequest', String(requestData.bActiveRequest));
    postdata.append('dtmCreated', requestData.dateRequest);
    postdata.append('dtmLastUpdated', requestData.dateRequest);

    var data: Observable<any> = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        this.PresentToast(requestData.szActivityId == ActivityId.AC002 ? "Berhasil mengajukan izin terlambat" :
          requestData.szActivityId == ActivityId.AC003 ? "Berhasil mengajukan izin datang diluar kantor" :
            requestData.szActivityId == ActivityId.AC004 ? "Berhasil mengajukan izin pulang diluar kantor" : "");
        this.router.navigate(['home']);
        this.dateRequest = "";
        this.timeRequest = "";
      }
      else {
        this.PresentAlert(data.error_msg);
        throw new Error(data.error_msg);
      }
    });
  }

  public CloseRequestData(szUserId: string, dateRequest: string, szActivityId: string) {
    this.requestDatas = [];
    var url = 'http://sihk.hutamakarya.com/apiabsen/CloseRequestData.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('dateRequest', dateRequest);
    postdata.append('szActivityId', szActivityId);
    postdata.append('dtmLastUpdated', new Date().toLocaleString());

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == true) { console.log("BUG: 'Gagal'"); }
    });
  }

  public UpdateRequestData(szRequestId: string, szStatusId: string) {
    var url = 'http://sihk.hutamakarya.com/apiabsen/UpdateRequestData.php';

    let postdata = new FormData();
    postdata.append('szRequestId', szRequestId);
    postdata.append('szStatusId', szStatusId);
    postdata.append('dtmLastUpdated', new Date().toLocaleString());

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        var szMessage = szStatusId == StatusId.ST001 ? "Berhasil menerima request" : "Berhasil menolak request";
        this.PresentToast(szMessage);
      }
      else {
        var errorData = new ErrorData();
        errorData.szMessage = data.error_msg;
        this.errorDatas.push(errorData);

        // this.PresentAlert(data.error_msg);
        // throw new Error(data.error_msg);
      }
    });
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

  PresentAlert(msg: string) {
    this.alertController.create({
      mode: 'ios',
      message: msg,
      buttons: ['OK']
    }).then(alert => {
      return alert.present();
    });
  }
}

export class UserData {
  public szUserId: string;
  public szPassword: string;
  public szFullName: string;
  public szShortName: string;
  public szTitleId: string;
  public szTitleName: string;
  public szDivisionId: string;
  public szDivisionName: string;
  public szSectionId: string;
  public szSectionName: string;
  public bStatusAdmin: boolean;
  public szImage: string;
  public szEmail: string;
  public szSuperiorUserId: string;
  public szSuperiorUserName: string;

  constructor() { }
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
  public decMonth: number;

  constructor() { }
}

export class ReportData {
  public szUserId: string;
  public dateAbsen: string;
  public timeArrived: string;
  public timeValidArrived: string;
  public timeReturn: string = "00:00:00";
  public timeValidReturn: string;
  public decMonth: number;
}

export class SummaryReportData {
  public szMonthAttendance: string;
  public decTotalAttendance: number;
  public decTotalAbsen: number;
  public decTotalLate: number;
  public decTotalBackEarly: number;
  public decTotalOvertime: number;
}

export class RequestData {
  public szRequestId: string;
  public szUserId: string;
  public szUserName: string;
  public szDivisionId: string;
  public szSectionId: string;
  public dateRequest: string;
  public szActivityId: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public szStatusId: string;
  public szStatusName: string;
  public decTotal: string;
  public szReasonImage: string;
  public bActiveRequest: boolean;
  // public szSuperiorUserId: string; // cek dipakek bener ga
  // public szSuperiorUserName: string; // cek dipakek bener ga
  // public timeArrived: string; // cek dipakek bener ga
  // public timeBack: string; // cek dipakek bener ga
}

export class ErrorData {
  public szMessage: string;
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
  public static readonly AC009: string = "AC009"; //Izin Khusus
  public static readonly AC010: string = "AC010"; //Izin Cuti
}

export class StatusId {
  public static readonly ST001: string = "ST001"; //Approved
  public static readonly ST002: string = "ST002"; //Not Approved 
  public static readonly ST003: string = "ST003"; //Need Approval 
}

