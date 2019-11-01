import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-report-monthly',
  templateUrl: './report-monthly.component.html',
  styleUrls: ['./report-monthly.component.scss'],
})
export class ReportMonthlyComponent implements OnInit {
  public summaryReportDatas = [];
  public txtCurrentYear: string;

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.txtCurrentYear = new Date().getFullYear().toString();
    this.GetReportAttendancePerMonthFromDb();
  }

  private GetReportAttendancePerMonthFromDb() {
    this.globalService.GetSummaryReportData(this.txtCurrentYear);
    this.summaryReportDatas = this.globalService.summaryReportDatas;
  }
}