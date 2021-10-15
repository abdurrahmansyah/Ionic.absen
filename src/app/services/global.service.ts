import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InjectorInstance } from '../app.module';
import { Observable } from 'rxjs';
import { ToastController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DatePipe } from '@angular/common';
import { FCM } from '@ionic-native/fcm/ngx';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';

declare var window;

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
  public diluarKantor: string;
  public location: string;
  public kota: string = "";
  public provinsi: string = "";
  public timestamp: number;
  public mobile: string = "";
  loading: any;

  httpClient = InjectorInstance.get<HttpClient>(HttpClient);
  readonly mobileIos = "mobile - iOS";
  readonly mobileAndroid = "mobile - Android";

  constructor(private router: Router,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private storage: Storage,
    private datePipe: DatePipe,
    private fcm: FCM,
    public loadingController: LoadingController,
    private platform: Platform,
    private localNotifications: LocalNotifications
  ) {
    this.InitializeApp();
    this.InitializeLoadingCtrl();
    this.InitializeData();
  }

  InitializeApp() {
    this.platform.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {
        this.PresentAlert("BUG : dari klik - " + res.text);
      });

      this.localNotifications.on('trigger').subscribe(res => {
        let msg = res.data ? res.data.mydata : "";
        if (msg.toUpperCase() == "TRACKING1".toUpperCase()) {
          window.app.backgroundGeolocation.start();
        }
        if (msg.toUpperCase() == "TRACKING2".toUpperCase()) {
          window.app.backgroundGeolocation.configure({pauseLocationUpdates: false});
          window.app.backgroundGeolocation.start();
        }
        if (msg.toUpperCase() == "TRACKING3".toUpperCase()) {
          window.app.backgroundGeolocation.configure({pauseLocationUpdates: false});
          window.app.backgroundGeolocation.start();
        }
      });

      this.localNotifications.on('schedule').subscribe(res => {
        this.PresentAlert("BUG : error from local notif schedule" + res.text);
      });
    });
  }

  public StartLocalNotification() {
    this.localNotifications.schedule([{
      id: 1,
      title: "Tracking WFH",
      text: "Anda berada diluar kantor, mohon minimize aplikasi namun tidak melakukan close app",
      data: { mydata: "TRACKING1" },
      trigger: { in: 2, unit: ELocalNotificationTriggerUnit.HOUR }
    }, {
      id: 2,
      title: "Tracking WFH",
      text: "Anda berada diluar kantor, mohon minimize aplikasi namun tidak melakukan close app",
      data: { mydata: "TRACKING2" },
      trigger: { in: 4, unit: ELocalNotificationTriggerUnit.HOUR }
    }, {
      id: 3,
      title: "Tracking WFH",
      text: "Anda berada diluar kantor, mohon minimize aplikasi namun tidak melakukan close app",
      data: { mydata: "TRACKING3" },
      trigger: { in: 6, unit: ELocalNotificationTriggerUnit.HOUR }
    }]);
  }

  public CancelLocalNotification() {
    this.localNotifications.cancel([1, 2, 3]);
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  private InitializeData() {
    if (this.platform.is('ios'))
      this.mobile = this.mobileIos;
    else
      this.mobile = this.mobileAndroid;
  }

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

  public GetDateByGMT(timestamp): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date(timestamp);

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

  public GetDateWithHourAndMinute(hour: number, minute: number): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date();
    date.setHours(hour, minute);

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
    var url = 'https://absensi.hutamakarya.com/api/office_hour';

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
    var url = 'https://absensi.hutamakarya.com/api/list/activity';

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
    activityData.wfoNewNormal = activityDataFromDb[10];
    activityData.wfoProyek = activityDataFromDb[11];

    return activityData;
  }

  public GetUserData(szUserId: string, szPassword: string) {
    this.PresentLoading();
    var url = 'https://absensi.hutamakarya.com/api/login';

    let postdata = new FormData();
    postdata.append('username', szUserId);
    postdata.append('password', szPassword);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {

        var userDataFromDb = data.data;//.find(x => x);
        var userData = this.MappingUserData(userDataFromDb);

        this.storage.set('userData', userData);
        this.loadingController.dismiss();
        this.PresentToast("Login Berhasil");
        this.authService.login();
        this.router.navigate(['home']);
      }
      else {
        this.loadingController.dismiss();
        this.PresentToast("Login Gagal");
      }
    });
  }

  public LoginSSO(szUserId: string, szPassword: string) {
    this.PresentLoading();
    var url = 'https://absensi.hutamakarya.com/api/authAD'; //ganti dengan API AD mas jerino

    let postdata = new FormData();
    postdata.append('username', szUserId);
    postdata.append('password', szPassword);


    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.auth == 1) {
        var url = 'https://absensi.hutamakarya.com/api/loginSSO'; // Kondisi kalau 
        var data: any = this.httpClient.post(url, postdata);
        data.subscribe(data => {
          if (data != null){ // #supaya jika ada email tapi tidak ada data di hk absen dia ditolak
            var userDataFromDb = data.data;//.find(x => x);
            var userData = this.MappingUserData(userDataFromDb);
  
            this.storage.set('userData', userData);
            this.loadingController.dismiss();
            this.PresentToast("Login Berhasil");
            this.authService.login();
            this.router.navigate(['home']);
          }
          else {
            this.loadingController.dismiss();
            this.PresentToast("Login Gagal");
          }
        });
      }
      else {
        this.loadingController.dismiss();
        this.PresentToast("Login Gagal");
      }
    });

  }

  public GetUserData2(requestData: RequestData, szUserId: string, szPassword: string) {
    var url = 'https://absensi.hutamakarya.com/api/login';

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
    var url = 'https://absensi.hutamakarya.com/api/attendance/set';
    let postdata = new FormData();
    postdata.append('attendance_type', this.mobile);
    postdata.append('authorization', reportData.szUserId);
    postdata.append('absen_date', reportData.dateAbsen);
    postdata.append('time', reportData.timeAbsen);
    postdata.append('capture_image', "");
    postdata.append('capture_ext', "png");
    postdata.append('is_request', reportData.isRequest);

    return this.httpClient.post(url, postdata);
  }

  public SaveReportDataWithRequest(reportData: ReportData): Observable<any> {
    var url = 'https://absensi.hutamakarya.com/api/attendance/request2';
    let postdata = new FormData();
    postdata.append('attendance_type', this.mobile);
    postdata.append('authorization', reportData.szUserId);
    postdata.append('absen_date', reportData.dateAbsen);
    postdata.append('time', reportData.timeAbsen);
    postdata.append('capture_image', reportData.szImage);
    postdata.append('capture_ext', "png");
    postdata.append('kota', reportData.kota);
    postdata.append('provinsi', reportData.provinsi);
    postdata.append('work_from', reportData.work_from);
    postdata.append('activity_id', reportData.szActivityId);
    postdata.append('reason', reportData.szDesc);
    postdata.append('dectotal', "no data");
    postdata.append('location', reportData.szLocation);
    postdata.append('health_check', reportData.health_check);
    postdata.append('suhu', reportData.suhu);
    postdata.append('interaksi', reportData.interaksi);
    postdata.append('riwayat_sakit', reportData.riwayat_sakit);
    postdata.append('kendaraan', reportData.kendaraan);
    postdata.append('rencana_keluar', reportData.rencana_keluar);
    postdata.append('external', reportData.external);
    postdata.append('kondisi_keluarga', reportData.kondisi_keluarga);
    postdata.append('hub_keluarga', reportData.hub_keluarga);
    postdata.append('umur_keluarga', reportData.umur_keluarga);
    postdata.append('desc_kondisi', reportData.desc_kondisi);
    postdata.append('waktu_olahraga', reportData.waktu_olahraga);
    postdata.append('jenis_olahraga', reportData.jenis_olahraga);
    postdata.append('is_request', reportData.isRequest);
    postdata.append('status', "aktif");

    return this.httpClient.post(url, postdata);
  }

  public GetReportData(szToken: string, dateAbsen: string) {
    var url = 'https://absensi.hutamakarya.com/api/attendance/perdate';

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
    var ampm = timeFromDb[0] > 12 ? "PM" : "AM";
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
    var url = 'https://absensi.hutamakarya.com/api/attendance/list_need_approval';

    let postdata = new FormData();
    postdata.append('authorization', this.userData.szToken);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.data.length > 0) {
        this.MappingRequestDataForNotifications(data.data);
      }
      else {
        this.requestDatas = [];
        this.PresentAlert("Tidak ada data yang dapat ditampilkan");
        throw new Error("Tidak ada data yang dapat ditampilkan");
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
    var url = 'https://absensi.hutamakarya.com/api/attendance/request';

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

  public GetLeaderboardDataList(total: number): Observable<any> {
    var dateData = this.GetDate();

    var url = 'https://absensi.hutamakarya.com/api/attendance/employee_limit/ASC/' + total + '?date=' + this.datePipe.transform(dateData.date, 'yyyy-MM-dd');

    return this.httpClient.get(url);
    // this.SubscribeGetLeaderboardDataList(data);
  }

  public GetTimeNow(): Observable<any> {
    var url = 'https://absensi.hutamakarya.com/api/timenow';

    return this.httpClient.get(url);
  }

  public GetVersionNumber(): Observable<any> {
    var url = 'https://absensi.hutamakarya.com/api/mobile_version';

    if (this.platform.is('ios'))
      url = 'https://absensi.hutamakarya.com/api/ios_version';

    return this.httpClient.get(url);
  }

  public SavePassword(currentPassword: string, newPassword: string) {
    var url = 'https://absensi.hutamakarya.com/api/update_password';

    let postdata = new FormData();
    postdata.append('authorization', this.userData.szToken);
    postdata.append('current_password', currentPassword);
    postdata.append('password', newPassword);

    var data: Observable<any> = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {
        this.loadingController.dismiss();
        this.PresentToast("Success update password");
      }
      else {
        this.loadingController.dismiss();
        this.PresentAlert(data.message);
        throw new Error(data.message);
      }
    });
  }

  public SaveNewActivity(reportData: ReportData): Observable<any> {
    var url = 'https://absensi.hutamakarya.com/api/attendance/setActivity';
    let postdata = new FormData();
    postdata.append('authorization', reportData.szUserId);
    postdata.append('activity_id', reportData.szActivityId);
    postdata.append('reason', reportData.szDesc);
    postdata.append('location', reportData.szLocation);
    postdata.append('kota', reportData.kota);
    postdata.append('provinsi', reportData.provinsi);
    postdata.append('work_from', reportData.work_from);
    postdata.append('suhu', reportData.suhu);
    postdata.append('health_check', reportData.health_check);
    postdata.append('interaksi', reportData.interaksi);
    postdata.append('riwayat_sakit', reportData.riwayat_sakit);
    postdata.append('kendaraan', reportData.kendaraan);
    postdata.append('rencana_keluar', reportData.rencana_keluar);
    postdata.append('external', reportData.external);
    postdata.append('kondisi_keluarga', reportData.kondisi_keluarga);
    postdata.append('hub_keluarga', reportData.hub_keluarga);
    postdata.append('umur_keluarga', reportData.umur_keluarga);
    postdata.append('desc_kondisi', reportData.desc_kondisi);
    postdata.append('waktu_olahraga', reportData.waktu_olahraga);
    postdata.append('jenis_olahraga', reportData.jenis_olahraga);

    return this.httpClient.post(url, postdata);
  }

  public SetTracking(trackingData: TrackingData): Observable<any> {
    var url = 'https://absensi.hutamakarya.com/api/attendance/setTracking';
    let postdata = new FormData();
    postdata.append('authorization', this.userData.szToken);
    postdata.append('lokasisch', trackingData.lokasiSch);
    postdata.append('datesch', trackingData.dateSch);
    postdata.append('timesch', trackingData.timeSch);
    postdata.append('scheduleke', trackingData.scheduleKe);

    return this.httpClient.post(url, postdata);
  }

  public pushNotif(title: string, body: string) {
    var url = 'https://absensi.hutamakarya.com/api/attendance/pushNotif';
    let postdata = new FormData();
    var TITLE = title != "" ? title : "HARAP MENGAKTIFKAN GPS";
    var BODY = body != "" ? body : "Hai. Aktifin GPSnya ya supaya absen rutin 2 jam sekali berjalan normal";

    postdata.append('authorization', this.userData.szToken);
    postdata.append('title', TITLE);
    postdata.append('body', BODY);

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      if (data.response == "success") {

        var targetnik = data.targetnik;
        var title = data.title;
        var body = data.body;
        console.log(targetnik, title, body);
      }
    });
  }

  public Logout() {
    this.PresentAlert("User tidak diperkenankan logout");

    // this.authService.logout();
    // this.fcm.unsubscribeFromTopic(this.userData.szUserId);
  }

  async PresentLoading() {
    await this.loading.present();
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
  public wfoNewNormal: any;
  public wfoProyek: any;
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
  public userData: UserData = new UserData();
  public szUserId: string;
  public dateAbsen: string;
  public timeAbsen: string;
  public timeArrived: string;
  public timeValidArrived: string;
  public timeReturn: string;
  public timeValidReturn: string;
  public decMonth: number;
  public isAnyActivity: boolean;
  public szActivityId: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public kota: string;
  public provinsi: string;
  public work_from: string;
  public decTotal: string = "";
  public szImage: string = "";
  public health_check: string = "";
  public suhu: string = "";
  public interaksi: string = "";
  public riwayat_sakit: string = "";
  public kendaraan: string = "";
  public rencana_keluar: string = "";
  public external: string = "";
  public kondisi_keluarga: string = "";
  public hub_keluarga: string = "";
  public umur_keluarga: string = "";
  public desc_kondisi: string = "";
  public waktu_olahraga: string = "";
  public jenis_olahraga: string = "";
  public szImageArrived: string;
  public szImageReturn: string;
  public isRequest: string;

  public workCondition: string; // WFH / WFO -> for team activity page
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

export class LeaderboardData {
  public number: number;
  public szUserId: string;
  public szUserName: string;
  public szDivisionName: string;
  public szSectionName: string;
  public checkIn: string;
  public szImage: string;
  public szSuperiorUserName: string;
}

export class TrackingData {
  public scheduleKe: string;
  public lokasiSch: string;
  public dateSch: string;
  public timeSch: string;

  constructor() { }
}

export class LocationData {
  public id: number;
  public provider: string;
  public latitude: string;
  public longitude: string;
  public time: string;
  public accuracy: string;
  public location: string;

  constructor() { }
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