import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService, ReportData } from 'src/app/services/global.service';
import { IonSlides } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  @ViewChild('slidesMonth', { static: true }) sliderMonth: IonSlides;
  indexTurn = 0; // do not disturb
  public dtmNow = new Date();
  public decCurrentDay = this.dtmNow.getDate();
  public decCurrentMonth = this.dtmNow.getMonth() + 1;
  public decCurrentYear = this.dtmNow.getFullYear();
  public buttonPropertyDatas = [];
  requestDatas = [];
  txtTimeArrived: string;
  txtTimeReturn: string;
  isArrived: boolean = false;
  isReturn: boolean = false;
  photoArrived: any = [];
  photoReturn: any = [];

  slideOpts = {
    initialSlide: new Date().getMonth(),
    speed: 400
  };

  constructor(private globalService: GlobalService,
    public http: HttpClient,
    private datePipe: DatePipe) {
    this.GetReportDatasForThisDay();
    // this.GetLoopRequestDatas();
  }

  ngOnInit() {
    this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
  }

  async slideMonthChanged() {
    if (this.indexTurn > 0) {
      this.decCurrentMonth = await this.sliderMonth.getActiveIndex() + 1;
      this.decCurrentDay = 1;
      this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
    }

    this.indexTurn++;
  }

  SetDataDaysInMonth(decMonth: number, decYear: number) {
    var totalDays = this.GetTotalDaysInMonth(decMonth, decYear);

    this.SetPropertyOfDataDaysInMonth(totalDays);
    this.SetCurrentDayToCenterPage();
  }

  GetTotalDaysInMonth(decMonth: number, decYear: number): number {
    return new Date(decYear, decMonth, 0).getDate();
  }

  private SetPropertyOfDataDaysInMonth(totalDays: number) {
    this.buttonPropertyDatas = [];

    for (var i = 1; i <= totalDays; i++) {
      var buttonPropertyData = new ButtonPropertyData();
      buttonPropertyData.date = i;
      if (buttonPropertyData.date == this.decCurrentDay) {
        buttonPropertyData.color = "danger";
        buttonPropertyData.fill = "solid";
      }
      else {
        buttonPropertyData.color = "dark";
        buttonPropertyData.fill = "clear";
      }
      this.buttonPropertyDatas.push(buttonPropertyData);
    }
  }

  SetCurrentDayToCenterPage() {
    console.log("Method 'SetCurrentDayToCenterPage' not implemented yet.");
  }

  public GetDayData(date: number) {
    if (this.decCurrentDay != date) {
      this.buttonPropertyDatas.forEach(element => {
        if (element.date == date) {
          element.color = "danger";
          element.fill = "solid";
        }
        if (element.date == this.decCurrentDay) {
          element.color = "dark";
          element.fill = "clear";
        }
      });

      this.decCurrentDay = date;
      this.GetReportDatasForThisDay();
    }
  }

  async GetReportDatasForThisDay() {
    var date = this.decCurrentYear + "/" + this.decCurrentMonth + "/" + this.decCurrentDay;

    var url = 'https://absensi.hutamakarya.com/api/attendance/perdate';
    let postdata = new FormData();

    postdata.append('authorization', this.globalService.userData.szToken);
    postdata.append('date', date);

    var data: Observable<any> = this.http.post(url, postdata);
    this.SubscribeGetReportDatas(data, false);
  }

  private async SubscribeGetReportDatas(data: Observable<any>, isDoingAbsen: boolean) {
    data.subscribe(data => {
      if (data.response == "success") {
        var reportDataFromDb = data.data ? data.data : data.data_db;
        var reportData: ReportData = this.MappingReportData(reportDataFromDb);

        console.log(reportData.szImageArrived);

        this.isArrived = reportData.szImageArrived.startsWith(',') ? false : reportData.szImageArrived ? true : false;
        this.isReturn = reportData.szImageReturn.startsWith(',') ? false : reportData.szImageReturn ? true : false;
        
        this.photoArrived = 'data:image/jpeg;base64,' + reportData.szImageArrived;
        this.photoReturn = 'data:image/jpeg;base64,' + reportData.szImageReturn;

        var timeValidArrived = reportData.timeValidArrived.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidArrived);
        this.txtTimeArrived = hour + ":" + minute + " " + ampm;

        var timeValidBack = reportData.timeValidReturn.split(':');
        var { hour, minute, ampm } = this.ConvertTimeToViewFormat(timeValidBack);
        this.txtTimeReturn = hour == 0 && minute == 0 ? "" : hour + ":" + minute + " " + ampm;

        if (this.txtTimeReturn != "")
          this.globalService.timeRequest = this.txtTimeReturn;
        else
          this.globalService.timeRequest = this.txtTimeArrived;
      }
      else {
        this.txtTimeArrived = "";
        this.txtTimeReturn = "";
      }
    });
  }

  private MappingReportData(reportDataFromDb: any) {
    var reportDatas = [];
    var reportData = new ReportData();
    reportData.szUserId = reportDataFromDb.employee_id;
    reportData.dateAbsen = reportDataFromDb.check_in_display ? reportDataFromDb.check_in_display.split(' ')[0] : reportDataFromDb.check_out_display.split(' ')[0];
    reportData.timeValidArrived = reportDataFromDb.check_in_display ? reportDataFromDb.check_in_display.split(' ')[1] : this.txtTimeArrived.split(' ')[0];
    reportData.timeValidReturn = reportDataFromDb.check_out_display ? reportDataFromDb.check_out_display.split(' ')[1] : "00:00";
    reportData.szImageArrived = reportDataFromDb.capture_in ? reportDataFromDb.capture_in : "";
    reportData.szImageReturn = reportDataFromDb.capture_out ? reportDataFromDb.capture_out : "";

    reportDatas.push(reportData);
    return reportDatas.find(x => x);
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0]; // < 10 && timeFromDb[0] != 0 ? "0" + timeFromDb[0] : timeFromDb[0];
    var minute = timeFromDb[1]; // < 10 && timeFromDb[1] != 0 ? "0" + timeFromDb[1] : timeFromDb[1];
    var ampm = timeFromDb[0] > 12 ? "PM" : "AM";
    return { hour, minute, ampm };
  }

  next() {
    this.sliderMonth.slideNext();
  }

  prev() {
    this.sliderMonth.slidePrev();
  }
}

class ButtonPropertyData {
  public date: number;
  public fill: string;
  public color: string;
}
