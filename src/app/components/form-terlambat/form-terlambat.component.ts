import { Component, OnInit } from '@angular/core';
import { ActivityId, StatusId, GlobalService, RequestData, DateData, ReportData } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-terlambat',
  templateUrl: './form-terlambat.component.html',
  styleUrls: ['./form-terlambat.component.scss'],
})
export class FormTerlambatComponent implements OnInit {
  public txtTimeRequest: string;
  public txtDesc: string;

  constructor(private globalService: GlobalService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.txtTimeRequest = this.globalService.timeRequest;
  }

  public SaveLateRequest() {
    try {
      this.ValidateData();
      this.SaveRequestData();
    } 
    catch (e) {
      this.alertController.create({
        mode: 'ios',
        message: e.message,
        buttons: ['OK']
      }).then(alert => {
        return alert.present();
      });
    }
  }

  private ValidateData() {
    if (!this.txtDesc) {
      throw new Error("Alasan wajib diisi.");
    }
  }

  private SaveRequestData() {
    var requestData = new RequestData();
    requestData.szUserId = this.globalService.userData.szUserId;
    requestData.dateRequest = this.globalService.dateRequest;
    requestData.szactivityid = ActivityId.AC002;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = "";
    requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = this.ReturnDecTotal();
    requestData.szReasonImage = "";
    requestData.bActiveRequest = true;
    this.globalService.SaveRequestData(requestData);
  }

  private ReturnDecTotal() {
    var time = this.txtTimeRequest.split(':');

    var decHour = +time[0] - 8;
    var decMinute = +time[1].split(' ')[0];

    if (decMinute < 10) {
      decHour = decHour - 1;
      decMinute = 60 - decMinute;
    } else {
      decMinute = decMinute - 10;
    }

    return decHour + "." + (decMinute.toString().length < 2 ? "0" + decMinute : decMinute);
  }
}