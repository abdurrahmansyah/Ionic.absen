import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-report-daily2',
  templateUrl: './report-daily2.component.html',
  styleUrls: ['./report-daily2.component.scss'],
})
export class ReportDaily2Component implements OnInit {

  requestDatas = [];

  constructor(private globalService: GlobalService) { 
    this.getLoopRequestDatas();
  }

  ngOnInit() {}

  getLoopRequestDatas() {
    setInterval(function () {
      this.getRequestDatas();
    }.bind(this), 500);
  }

  getRequestDatas() {
    this.requestDatas = this.globalService.requestDatas;
  }
}
