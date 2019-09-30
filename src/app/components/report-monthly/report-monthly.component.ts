import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-monthly',
  templateUrl: './report-monthly.component.html',
  styleUrls: ['./report-monthly.component.scss'],
})
export class ReportMonthlyComponent implements OnInit {
  public reportDatas = [];

  constructor() { }

  ngOnInit() {
    this.GetReportAttendancePerMonthFromDb();
  }

  private GetReportAttendancePerMonthFromDb() {
    var reportData = new ReportData();
    reportData.szMonthAttendance = "Januari 2019";
    reportData.decTotalAttendance = 22;
    reportData.decTotalAbsen = 1;
    reportData.decTotalLate = 2.1;
    reportData.decTotalOvertime = 52.3;
    reportData.decTotalBackEarly = 0;
    this.reportDatas.push(reportData);
    var reportData = new ReportData();
    reportData.szMonthAttendance = "Februari 2019";
    reportData.decTotalAttendance = 23;
    reportData.decTotalAbsen = 0;
    reportData.decTotalLate = 0;
    reportData.decTotalOvertime = 61.8;
    reportData.decTotalBackEarly = 0.2;
    this.reportDatas.push(reportData);
  }
}

class ReportData {
  public szMonthAttendance: string;
  public decTotalAttendance: number;
  public decTotalAbsen: number;
  public decTotalLate: number;
  public decTotalBackEarly: number;
  public decTotalOvertime: number;
}