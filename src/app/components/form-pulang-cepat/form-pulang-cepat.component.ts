import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivityId, StatusId, GlobalService, RequestData, DateData } from 'src/app/services/global.service';


@Component({
  selector: 'app-form-pulang-cepat',
  templateUrl: './form-pulang-cepat.component.html',
  styleUrls: ['./form-pulang-cepat.component.scss'],
})
export class FormPulangCepatComponent implements OnInit {
  public txtTimeNow: string;
  public txtDesc: string;
  public dateData: DateData;

  constructor(
    private storage: Storage,
    private globalService: GlobalService
  ) {
    this.Timer();
  }

  ngOnInit() {
    this.dateData = this.globalService.GetDate();
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

  public SaveBackRequest() {
    var requestData = new RequestData();
    requestData.szUserId = this.globalService.userData.szUserId;
    requestData.szactivityid = ActivityId.AC005;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = "";
    requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = this.ReturnDecTotal();
    this.globalService.SaveRequest(requestData, this.dateData);
  }

  private ReturnDecTotal() {
    var decHour = this.dateData.decHour - 8;
    var decMinute = this.dateData.decMinute;

    if (decMinute < 10) {
      decHour = decHour - 1;
      decMinute = 60 - decMinute;
    } else {
      decMinute = decMinute - 10;
    }
    console.log(decMinute);
    console.log(decHour + "." + decMinute);
    console.log(decMinute);
    
    return decHour + "." + decMinute;
  }
}