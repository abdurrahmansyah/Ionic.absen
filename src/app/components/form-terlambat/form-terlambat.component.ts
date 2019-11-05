import { Component, OnInit } from '@angular/core';
import { ActivityId, StatusId, GlobalService, RequestData, DateData } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-terlambat',
  templateUrl: './form-terlambat.component.html',
  styleUrls: ['./form-terlambat.component.scss'],
})
export class FormTerlambatComponent implements OnInit {
  public txtTimeNow: string;
  public txtDesc: string;
  public dateData: DateData;

  constructor(
    private globalService: GlobalService
  ) {
    this.Timer();
  }

  ngOnInit() {
    this.dateData = this.globalService.GetDate();
    if (this.globalService.timeRequest)
      this.txtTimeNow = this.globalService.timeRequest;
    else
      this.txtTimeNow = this.CheckTime(this.dateData.decHour) + ":" + this.CheckTime(this.dateData.decMinute) + ":" + this.CheckTime(this.dateData.decSec) + " " + this.dateData.szAMPM;
  }

  private CheckTime(i: any) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  private Timer() {
    setInterval(function () {
      this.ngOnInit();
    }.bind(this), 500);
  }

  public SaveLateRequest() {
    var requestData = new RequestData();
    requestData.szUserId = this.globalService.userData.szUserId;
    requestData.szactivityid = ActivityId.AC002;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = "";
    requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = this.ReturnDecTotal();
    requestData.szReasonImage = "";
    requestData.bActiveRequest = true;
    this.globalService.SaveRequest(requestData, this.dateData);
  }

  private ReturnDecTotal() {
    var time = this.txtTimeNow.split(':');
    
    var decHour = +time[0] - 8;
    var decMinute = +time[1].split(' ')[0];

    if (decMinute < 10) {
      decHour = decHour - 1;
      decMinute = 60 - decMinute;
    } else {
      decMinute = decMinute - 10;
    }

    return decHour + "." + decMinute;
  }
}