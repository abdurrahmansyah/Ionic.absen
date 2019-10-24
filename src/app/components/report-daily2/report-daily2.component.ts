import { Component, OnInit } from '@angular/core';
import { GlobalService, RequestData } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-report-daily2',
  templateUrl: './report-daily2.component.html',
  styleUrls: ['./report-daily2.component.scss'],
})
export class ReportDaily2Component implements OnInit {

  requestDatas = [];
  txtTimeArrived: string;
  txtTimeReturn: string;

  constructor(
    private globalService: GlobalService,
    public http: HttpClient,
    private storage: Storage) {
    this.GetLoopRequestDatas();
  }

  ngOnInit() { }

  GetLoopRequestDatas() {
    setInterval(function () {
      this.GetRequestDatas();
    }.bind(this), 500);
  }

  GetRequestDatas() {
    this.requestDatas = this.globalService.requestDatas;
    this.txtTimeArrived = this.globalService.timeArrived;
    this.txtTimeReturn = this.globalService.timeReturn;
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0] - 17;
    var minute = timeFromDb[1] - 0;
    var ampm = timeFromDb[2];
    return { hour, minute, ampm };
  }
}
