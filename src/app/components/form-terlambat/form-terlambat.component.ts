import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  szUserId: string;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private storage: Storage,
    private globalService: GlobalService
  ) {
    this.GetUserId();
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

  async GetUserId() {
    //Fungsi untuk mengambil value pada local storage
    await this.storage.get('szUserId').then((szUserId) => {
      this.szUserId = szUserId;
    });
  }

  SaveLateRequest() {
    var requestData = new RequestData();
    requestData.szUserId = this.szUserId;
    requestData.szactivityid = ActivityId.AC002;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = "";
    requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = "0";
    this.globalService.SaveRequest(requestData, this.dateData);
  }
}