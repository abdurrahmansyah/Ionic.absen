import { Component, OnInit } from '@angular/core';
import { GlobalService, ReportData } from 'src/app/services/global.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-team-activity',
  templateUrl: './team-activity.page.html',
  styleUrls: ['./team-activity.page.scss'],
})
export class TeamActivityPage implements OnInit {
  public activityDatas = [];
  private loading: any;

  constructor(private globalService: GlobalService,
    private inAppBrowser: InAppBrowser,
    private datePipe: DatePipe,
    public http: HttpClient,
    public router: Router,
    private loadingController: LoadingController
  ) {
    this.InitializeLoadingCtrl();
  }

  ngOnInit() {
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  ionViewWillEnter() {
    this.PresentLoading();
    this.GetTodayReportData();
  }

  async PresentLoading() {
    await this.loading.present();
  }

  private GetTodayReportData() {
    var dateData = this.globalService.GetDate();

    var url = 'https://absensi.hutamakarya.com/api/activity/perdivision';
    let postdata = new FormData();

    postdata.append('authorization', this.globalService.userData.szToken);
    postdata.append('date', this.datePipe.transform(dateData.date, 'yyyy-MM-dd'));
    // postdata.append('date', '2020-05-28');

    var data: Observable<any> = this.http.post(url, postdata);
    this.SubscribeGetReportDatas(data, false);
  }

  private async SubscribeGetReportDatas(data: Observable<any>, isDoingAbsen: boolean) {
    data.subscribe(data => {
      if (data.response == "success" && data.count2 > 0) {
        var reportDatasFromDb = data.data;
        this.MappingReportData(reportDatasFromDb);

        this.loadingController.dismiss();
      }
      else {
        this.loadingController.dismiss();
        this.globalService.PresentAlert("Tidak ada data yang dapat ditampilkan");
      }
    });
  }

  private MappingReportData(reportDatasFromDb: any) {
    reportDatasFromDb.forEach(reportDataFromDb => {
      if (reportDataFromDb.attendance.length > 0) {
        var reportData = new ReportData();
        var attendanceData = reportDataFromDb.attendance[0];
        var employeeData = reportDataFromDb.dataemployee[0];
        var activityData = reportDataFromDb.activity;

        reportData.szUserId = employeeData.id;
        reportData.userData.szUserName = employeeData.name;
        reportData.userData.szImage = 'data:image/jpeg;base64,' + employeeData.face1_attach;
        reportData.userData.szDivisionName = employeeData.divisi_id[1];
        reportData.userData.szSectionName = employeeData.department_id[1];
        reportData.dateAbsen = attendanceData.check_in_display ? attendanceData.check_in_display.split(' ')[0] : attendanceData.check_out_display.split(' ')[0];
        var timeValidArrived = attendanceData.check_in_display ? attendanceData.check_in_display.split(' ')[1].split(':') : "00:00".split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        reportData.timeValidArrived = hour + ":" + minute + " " + ampm;
        var timeValidReturn = attendanceData.check_out_display ? attendanceData.check_out_display.split(' ')[1].split(':') : "00:00".split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidReturn);
        reportData.timeValidReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;
        reportData.work_from = attendanceData.work_from;
        reportData.isAnyActivity = activityData.length > 0 ? true : false;
        reportData.szActivityId = activityData.length > 0 ? activityData[0].activity_type_id[0] : "";
        reportData.szActivityName = activityData.length > 0 ? activityData[0].activity_type_id[1] : "";
        reportData.szLocation = attendanceData.check_in_location;
        reportData.szDesc = activityData.length > 0 ? activityData[0].reason : "";
        reportData.workCondition = attendanceData.work_from;
        reportData.health_check = activityData.length > 0 ? activityData[0].health_check : "";
        reportData.suhu = activityData.length > 0 ? activityData[0].suhu  + " Celcius": "";
        reportData.interaksi = activityData.length > 0 ? activityData[0].interaksi : "";
        reportData.riwayat_sakit = activityData.length > 0 ? activityData[0].riwayat_sakit : "";
        reportData.kendaraan = activityData.length > 0 ? activityData[0].kendaraan : "";
        reportData.rencana_keluar = activityData.length > 0 ? activityData[0].rencana_keluar : "";
        reportData.external = activityData.length > 0 ? activityData[0].external : "";
        reportData.kondisi_keluarga = activityData.length > 0 ? activityData[0].kondisi_keluarga : "";
        reportData.waktu_olahraga = attendanceData.waktu_olahraga;
        reportData.jenis_olahraga = attendanceData.jenis_olahraga;
        
        this.activityDatas.push(reportData);
      }
    });
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
}
