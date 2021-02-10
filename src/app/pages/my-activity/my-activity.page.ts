import { Component, OnInit } from '@angular/core';
import { GlobalService, ReportData } from 'src/app/services/global.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-activity',
  templateUrl: './my-activity.page.html',
  styleUrls: ['./my-activity.page.scss'],
})
export class MyActivityPage implements OnInit {
  public txtUserName: string;
  public txtSectionName: string;
  public txtDivisionName: string;
  public txtWork: string;
  public txtLocation: string;
  public txtHealthCheck: string;
  public txtSuhu: string;
  public txtInteraksi: string;
  public txtRiwayatSakit: string;
  public txtTimeArrived: string;
  public txtTimeReturn: string;
  public txtKendaraan: string;
  public txtRencanaKeluar: string;
  public txtExternal: string;
  public txtKondisiKeluarga: string;
  public txtWaktuOlahraga: string;
  public txtJenisOlahraga: string;
  public isNoActivity: boolean = false;
  public isNoReport: boolean = false;

  constructor(private globalService: GlobalService,
    private inAppBrowser: InAppBrowser,
    private datePipe: DatePipe,
    public http: HttpClient,
    public router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.txtUserName = this.globalService.userData.szUserName;
    this.txtSectionName = this.globalService.userData.szSectionName;
    this.txtDivisionName = this.globalService.userData.szDivisionName;
    this.GetTodayReportData();
  }

  private GetTodayReportData() {
    var dateData = this.globalService.GetDate();

    var url = 'https://absensi.hutamakarya.com/api/attendance/perdate';
    let postdata = new FormData();

    postdata.append('authorization', this.globalService.userData.szToken);
    postdata.append('date', this.datePipe.transform(dateData.date, 'yyyy-MM-dd'));

    var data: Observable<any> = this.http.post(url, postdata);
    this.SubscribeGetReportDatas(data, false);
  }

  private async SubscribeGetReportDatas(data: Observable<any>, isDoingAbsen: boolean) {
    data.subscribe(data => {
      if (data.response == "success") {
        var reportDataFromDb = data.data ? data.data : data.data_db;
        var reportData: ReportData = this.MappingReportData(reportDataFromDb);

        var timeValidArrived = reportData.timeValidArrived.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.txtTimeArrived = hour + ":" + minute + " " + ampm;

        var timeValidReturn = reportData.timeValidReturn.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidReturn);
        this.txtTimeReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;

        if (reportData.szDesc) {
          this.txtWork = reportData.work_from;
          this.txtLocation = reportData.szLocation;
          this.txtSuhu = reportData.suhu  + " Celcius";
          this.txtHealthCheck = reportData.health_check;
          this.txtInteraksi = reportData.interaksi;
          this.txtRiwayatSakit = reportData.riwayat_sakit;
          this.txtKendaraan = reportData.kendaraan;
          this.txtRencanaKeluar = reportData.rencana_keluar;
          this.txtExternal = reportData.external;
          this.txtKondisiKeluarga = reportData.kondisi_keluarga;
          this.txtWaktuOlahraga = reportData.waktu_olahraga;
          this.txtJenisOlahraga = reportData.jenis_olahraga;
        }
        else {
          this.isNoActivity = true;
        }
      }
      else {
        this.isNoReport = true;
      }
    });
  }

  private MappingReportData(reportDataFromDb: any) {
    console.log(reportDataFromDb);
    console.log(reportDataFromDb.activity.length);

    var reportDatas = [];
    var reportData = new ReportData();
    reportData.szUserId = reportDataFromDb.employee_id;
    reportData.dateAbsen = reportDataFromDb.check_in_display ? reportDataFromDb.check_in_display.split(' ')[0] : reportDataFromDb.check_out_display.split(' ')[0];
    reportData.timeValidArrived = reportDataFromDb.check_in_display ? reportDataFromDb.check_in_display.split(' ')[1] : "00:00";
    reportData.timeValidReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";
    reportData.szActivityId = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].activity_type_id[0] : "";
    reportData.szActivityName = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].activity_type_id[1] : "";
    reportData.szLocation = reportDataFromDb.check_in_location;
    reportData.work_from = reportDataFromDb.work_from;
    reportData.waktu_olahraga = reportDataFromDb.waktu_olahraga ? reportDataFromDb.waktu_olahraga : "";
    reportData.jenis_olahraga = reportDataFromDb.jenis_olahraga ? reportDataFromDb.jenis_olahraga : "";
    reportData.szDesc = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].reason : "";
    reportData.health_check = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].health_check : "";
    reportData.suhu = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].suhu : "";
    reportData.interaksi = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].interaksi : "";
    reportData.riwayat_sakit = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].riwayat_sakit : "";
    reportData.kendaraan = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].kendaraan : "";
    reportData.rencana_keluar = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].rencana_keluar : "";
    reportData.external = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].external : "";
    reportData.kondisi_keluarga = reportDataFromDb.activity.length > 0 ? reportDataFromDb.activity[0].kondisi_keluarga : "";

    reportDatas.push(reportData);
    return reportDatas.find(x => x);
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[0] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  public OpenOutlook() {
    this.inAppBrowser.create("https://outlook.office.com/calendar/view/month/");
  }

  public AddActivity() {
    this.globalService.timeRequest = this.txtTimeArrived;
    this.router.navigate(['new-activity']);
  }

  public DoingAbsen() {
    this.router.navigate(['home']);
  }
}
