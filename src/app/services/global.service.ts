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
  public officeHourData = new OfficeHourData();
  public activityDataList = new ActivityData();
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
  readonly mobile = "mobile";

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

  public GetOfficeHour() {
    var url = 'http://192.168.12.23/api/office_hour';

    var data: any = this.httpClient.get(url);
    data.subscribe(data => {
      this.officeHourData = this.MappingOfficeHourData(data);
    });
  }

  private MappingOfficeHourData(officeHourDataFromDb: any) {
    var officeHourData = new OfficeHourData();

    officeHourData.startOfficeHourFrom = officeHourDataFromDb.start_office_hour_from;
    officeHourData.startOfficeHourUntil = officeHourDataFromDb.start_office_hour_until;
    officeHourData.endtOfficeHourFrom = officeHourDataFromDb.end_office_hour_from;
    officeHourData.endOfficeHourUntil = officeHourDataFromDb.end_office_hour_until;

    return officeHourData;
  }

  public GetActivityData() {
    var url = 'http://192.168.12.23/api/list/activity';

    var data: any = this.httpClient.get(url);
    data.subscribe(data => {
      this.activityDataList = this.MappingActivityData(data);
    });
  }

  private MappingActivityData(activityDataFromDb: any) {
    var activityData = new ActivityData();

    activityData.onTime = activityDataFromDb[0];
    activityData.terlambat = activityDataFromDb[1];
    activityData.datangDiluarKantor = activityDataFromDb[2];
    activityData.pulangDiluarKantor = activityDataFromDb[3];
    activityData.pulangCepat = activityDataFromDb[4];
    activityData.lembur = activityDataFromDb[5];
    activityData.absen = activityDataFromDb[6];
    activityData.sakit = activityDataFromDb[7];
    activityData.izin = activityDataFromDb[8];
    activityData.cuti = activityDataFromDb[9];

    return activityData;
  }

  public GetUserData(szUserId: string, szPassword: string) {
    var url = 'http://192.168.12.23/api/login';

    let postdata = new FormData();
    postdata.append('username', szUserId);
    postdata.append('password', szPassword);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {

        var userDataFromDb = data.data;//.find(x => x);
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

  public GetUserData2(requestData: RequestData, szUserId: string, szPassword: string) {
    var url = 'http://192.168.12.23/api/login';

    let postdata = new FormData();
    postdata.append('username', szUserId);
    postdata.append('password', szPassword);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {

        var userDataFromDb = data.data;
        var userData = this.MappingUserData(userDataFromDb);
        requestData.szUserPhoto = userData.szImage;
        requestData.szDivisionId = userData.szDivisionName;
        requestData.szSectionId = userData.szSectionName;
        console.log(userData);
      }
      else {
        this.PresentToast("Login Gagal");
      }
    });
  }

  private MappingUserData(userDataFromDb: any) {
    var userData = new UserData();
    userData.szToken = userDataFromDb.token;
    userData.szTokenFcm = userDataFromDb.token_fcm;
    userData.szUserId = userDataFromDb.nik;
    userData.szUserName = userDataFromDb.name;
    userData.szTitleId = userDataFromDb.title_id;
    userData.szTitleName = userDataFromDb.title_name;
    userData.szDivisionId = userDataFromDb.divisi_id;
    userData.szDivisionName = userDataFromDb.divisi_name;
    userData.szSectionId = userDataFromDb.section_id;
    userData.szSectionName = userDataFromDb.section_name;
    userData.szImage = 'data:image/jpeg;base64,' + userDataFromDb.image;
    userData.szEmail = userDataFromDb.email_hk;
    userData.szSuperiorUserId = userDataFromDb.superior_id;
    userData.szSuperiorUserName = userDataFromDb.superior_name;

    return userData;
  }

  public SaveReportData(reportData: ReportData): Observable<any> {
    var url = 'http://192.168.12.23/api/attendance/set';
    let postdata = new FormData();
    postdata.append('attendance_type', this.mobile);
    postdata.append('authorization', reportData.szUserId);
    postdata.append('absen_date', reportData.dateAbsen);
    postdata.append('time', reportData.timeAbsen);
    postdata.append('capture_image', "");
    postdata.append('capture_ext', "png");

    return this.httpClient.post(url, postdata);
  }

  public GetReportData(szToken: string, dateAbsen: string) {
    var url = 'http://192.168.12.23/api/attendance/perdate';

    let postdata = new FormData();
    postdata.append('authorization', szToken);
    postdata.append('date', dateAbsen);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {
        var reportDataFromDb = data.data;
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
    reportData.dateAbsen = reportDataFromDb.check_in_display.split(' ')[0];
    // reportData.timeArrived = reportDataFromDb.check_in_display.split(' ')[1];
    reportData.timeValidArrived = reportDataFromDb.check_in_display.split(' ')[1];
    // reportData.timeReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";
    reportData.timeValidReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";

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
          summaryReportData.decTotalLate = +parseFloat(reportDatasPerMonth.filter(y => y.szstatusid == "ST001" && y.szactivityid == "AC002").reduce((sum, current) => sum + +current.dectotal, 0)).toFixed(2);
          summaryReportData.decTotalBackEarly = +parseFloat(reportDatasPerMonth.filter(y => y.szstatusid == "ST001" && y.szactivityid == "AC005").reduce((sum, current) => sum + +current.dectotal, 0)).toFixed(2);
          summaryReportData.decTotalOvertime = +parseFloat(reportDatasPerMonth.filter(y => y.szstatusid == "ST001" && y.szactivityid == "AC006").reduce((sum, current) => sum + +current.dectotal, 0)).toFixed(2);
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
    // var url = 'http://sihk.hutamakarya.com/apiabsen/GetRequestDatasForNotifications.php';
    var url = 'http://192.168.12.23/api/attendance/list_need_approval';

    let postdata = new FormData();
    postdata.append('authorization', this.userData.szToken);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.data.length > 0) {
        this.MappingRequestDataForNotifications(data.data);
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
      var length = reqData.data_activity.length;
      var requestData = new RequestData();
      requestData.szRequestId = reqData.id;
      requestData.szUserId = reqData.employee_id[0];

      this.GetUserData2(requestData, "KD19.9797", "Hutama123!");

      requestData.szUserName = reqData.employee_id[1];
      requestData.szDivisionId = "reqData.szdivisionid";
      requestData.szSectionId = "reqData.szsectionid";
      requestData.dateRequest = this.ReturnDate(reqData.check_in);
      
      reqData.data_activity.forEach(reqDetailData => {
        var requestDetailData = new RequestDetailData();
        requestDetailData.szActivityId = reqDetailData.activity_id;
        requestDetailData.szActivityName = reqDetailData.activity_name;
        requestDetailData.szDesc = reqDetailData.reason;
        requestDetailData.szLocation = reqDetailData.location;
        requestDetailData.decTotal = reqDetailData.dectotal;
        requestDetailData.szReasonImage = 'data:image/jpeg;base64,' + reqData.szreasonimage;
        requestDetailData.isLastData = length == 1 ? true : false;
        length -= 1;
        requestData.requestDetailDataList.push(requestDetailData);
      });
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
    var url = 'http://192.168.12.23/api/attendance/request';

    let postdata = new FormData();
    postdata.append('attendance_type', this.mobile);
    postdata.append('authorization', requestData.szUserId);
    postdata.append('absen_date', requestData.dateRequest);
    postdata.append('time', requestData.timeRequest);
    postdata.append('capture_image', "");
    postdata.append('capture_ext', "png");
    postdata.append('activity_id', requestData.szActivityId);
    postdata.append('reason', requestData.szDesc);
    postdata.append('dectotal', requestData.decTotal);
    postdata.append('location', requestData.szLocation);

    var data: Observable<any> = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {
        this.PresentToast(requestData.szActivityId == this.activityDataList.terlambat.id ? "Berhasil mengajukan izin terlambat" :
          requestData.szActivityId == this.activityDataList.pulangCepat.id ? "Berhasil mengajukan izin pulang cepat" :
            requestData.szActivityId == this.activityDataList.lembur.id ? "Berhasil mengajukan izin lembur" :
              requestData.szActivityId == this.activityDataList.datangDiluarKantor.id ? "Berhasil mengajukan izin datang diluar kantor" :
                requestData.szActivityId == this.activityDataList.pulangDiluarKantor.id ? "Berhasil mengajukan izin pulang diluar kantor" : "");
        this.router.navigate(['home']);
        this.dateRequest = "";
        this.timeRequest = "";
      }
      else {
        this.PresentAlert("Gagal melakukan request");
        throw new Error("Gagal melakukan request");
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

export class OfficeHourData {
  public startOfficeHourFrom: string;
  public startOfficeHourUntil: string;
  public endtOfficeHourFrom: string;
  public endOfficeHourUntil: string;
}

export class ActivityData {
  public onTime: any;
  public terlambat: any;
  public datangDiluarKantor: any;
  public pulangDiluarKantor: any;
  public pulangCepat: any;
  public lembur: any;
  public absen: any;
  public sakit: any;
  public izin: any;
  public cuti: any;
}

export class UserData {
  public szToken: string;
  public szTokenFcm: string;
  public szUserId: string;
  public szUserName: string;
  public szTitleId: string;
  public szTitleName: string;
  public szDivisionId: string;
  public szDivisionName: string;
  public szSectionId: string;
  public szSectionName: string;
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
  public timeAbsen: string;
  public timeArrived: string;
  public timeValidArrived: string;
  public timeReturn: string = "00:00:00";
  public timeValidReturn: string;
  public decMonth: number;
  public szActivityId: string;
  public szDesc: string;
  public szLocation: string;
  public decTotal: string;
  public szImage: string;
  public szImageArrived: string;
  public szImageReturn: string;
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
  public szUserPhoto: string;
  public szDivisionId: string;
  public szSectionId: string;
  public dateRequest: string;
  public timeRequest: string;
  public requestDetailDataList: any = [];
  public szActivityId: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public szStatusId: string;
  public szStatusName: string;
  public decTotal: string;
  public szReasonImage: string;
  // public bActiveRequest: boolean;
  // public szSuperiorUserId: string; // cek dipakek bener ga
  // public szSuperiorUserName: string; // cek dipakek bener ga
  // public timeArrived: string; // cek dipakek bener ga
  // public timeBack: string; // cek dipakek bener ga
}

export class RequestDetailData {
  // public szRequestId: string;
  // public szUserId: string;
  // public szUserName: string;
  // public szDivisionId: string;
  // public szSectionId: string;
  // public dateRequest: string;
  // public timeRequest: string;
  public szActivityId: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public szStatusId: string;
  public szStatusName: string;
  public decTotal: string;
  public szReasonImage: string;
  public bActiveRequest: boolean;
  public isLastData: boolean;
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

