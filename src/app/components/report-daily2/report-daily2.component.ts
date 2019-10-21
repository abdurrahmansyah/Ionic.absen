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
  txtTimeLate: string;
  txtTimeOver: string;
  txtTimeBelow: string;

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

    var totalterlambat = this.txtTimeArrived.split(':');
    var { hour, minute, ampm } = this.ConvertTimeToViewFormatLate(totalterlambat);
    this.txtTimeLate = hour + ":" + minute + ":" + ampm;

    // var totallembur = this.txtTimeReturn.split(':'); //get api read jam datang
    // var { hour, minute, ampm } = this.ConvertTimeToViewFormat(totallembur);
    // this.txtTimeOver = hour + ":" + minute + ":" + ampm;

    // var totalpulang = this.txtTimeReturn.split(':'); //get api read jam datang
    // var { hour, minute, ampm } = this.ConvertTimeToViewFormat(totalpulang);
    // this.txtTimeBelow = hour + ":" + minute + ":" + ampm;
  }

  private ConvertTimeToViewFormatLate(timeFromDb: any) {
    var hour1 = timeFromDb[0] - 8;
    var minute1 = timeFromDb[1];
    if (minute1 < 10) {
      var hour = hour1 - 1;
      var minute = 60 - minute1;
    } else {
      var hour = hour1;
      var minute = minute1 - 10;
    }
    var ampm = timeFromDb[2];
    return { hour, minute, ampm };
  }

  private ConvertTimeToViewFormat(timeFromDb: any) {
    var hour = timeFromDb[0] - 17;
    var minute = timeFromDb[1] - 0;
    var ampm = timeFromDb[2];
    return { hour, minute, ampm };
  }

}
