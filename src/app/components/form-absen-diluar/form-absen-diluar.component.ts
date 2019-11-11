import { Component, OnInit } from '@angular/core';
import { ActivityId, StatusId, GlobalService, RequestData, ReportData } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-form-absen-diluar',
  templateUrl: './form-absen-diluar.component.html',
  styleUrls: ['./form-absen-diluar.component.scss'],
})
export class FormAbsenDiluarComponent implements OnInit {
  public txtTimeRequest: string;
  public txtDesc: string;
  public photo: any = [];
  private timeReport: string;
  private dataimage: string;

  constructor(private camera: Camera,
    private alertController: AlertController,
    private globalService: GlobalService) {
  }

  ngOnInit() {
    this.txtTimeRequest = this.globalService.timeRequest;
    this.timeReport = this.globalService.timeRequest.split(' ')[0] + ":00";
  }

  public SaveOutsideRequest() {
    try {
      this.ValidateData();

      var timeArrived: string;
      var timeReturn: string;

      if (this.globalService.isArrived) {
        timeArrived = this.timeReport;
        timeReturn = "00:00:00"
        this.SaveRequestData(ActivityId.AC003);
      } 
      else {
        timeArrived = "00:00:00";
        timeReturn = this.timeReport;
        this.SaveRequestData(ActivityId.AC004);
      }
      this.SaveReportData(timeArrived, timeReturn);
    } catch (e) {
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

    if (!this.dataimage) {
      throw new Error("Foto wajib diisi.");
    }
  }

  private SaveRequestData(szActivityId: string) {
    var requestData = new RequestData();
    requestData.szUserId = this.globalService.userData.szUserId;
    requestData.dateRequest = this.globalService.dateRequest;
    requestData.szactivityid = szActivityId;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = this.globalService.geoLatitude + ", " + this.globalService.geoLongitude;
    requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = "";
    requestData.szReasonImage = this.dataimage;
    requestData.bActiveRequest = true;
    this.globalService.SaveRequestData(requestData);
  }

  private SaveReportData(timeArrived: string, timeReturn: string) {
    var reportData = new ReportData();
    reportData.timeArrived = timeArrived;
    reportData.timeValidArrived = timeArrived;
    reportData.timeReturn = timeReturn;
    reportData.timeValidReturn = timeReturn;
    reportData.szUserId = this.globalService.userData.szUserId;
    reportData.dateAbsen = this.globalService.dateRequest;
    this.globalService.SaveReportData(reportData);
  }

  TakePhotos() {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      allowEdit: true,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
      this.dataimage = imageData;
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

}
