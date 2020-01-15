import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivityId, StatusId, GlobalService, RequestData, DateData } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-lembur',
  templateUrl: './form-lembur.component.html',
  styleUrls: ['./form-lembur.component.scss'],
})
export class FormLemburComponent implements OnInit {
  public txtTimeRequest: string;
  public txtDesc: string;

  constructor(private globalService: GlobalService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.txtTimeRequest = this.globalService.timeRequest;
  }

  public SaveOvertimeRequest() {
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
    requestData.szUserId = this.globalService.userData.szToken;
    requestData.dateRequest = this.globalService.dateRequest;
    requestData.timeRequest = this.globalService.timeRequest;
    requestData.szActivityId = this.globalService.activityDataList.lembur.id;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = "";
    // requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = this.ReturnDecTotal();
    requestData.szReasonImage = "";
    // requestData.bActiveRequest = true;
    this.globalService.SaveRequestData(requestData);
  }

  private ReturnDecTotal() {
    var time = this.txtTimeRequest.split(':');

    var decHour = +time[0] - 17;
    var decMinute = +time[1].split(' ')[0];
    
    return decHour + "." + (decMinute.toString().length < 2 ? "0" + decMinute : decMinute);
  }
}
