import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivityId, StatusId, GlobalService, RequestData, DateData, ReportData } from 'src/app/services/global.service';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-form-absen-diluar',
  templateUrl: './form-absen-diluar.component.html',
  styleUrls: ['./form-absen-diluar.component.scss'],
})
export class FormAbsenDiluarComponent implements OnInit {
  public txtTimeNow: string;
  public txtDesc: string;
  public dateData: DateData;
  photo: any = [];
  timeReport: string;
  dataimage: string;
  timeReturn: string;
  timeArrived: string;

  constructor(public navCtrl: NavController, public file: File, private camera: Camera, private storage: Storage,
    private globalService: GlobalService) {
    this.Timer();
    // this.photo = this.globalService.photo;
  }


  ngOnInit() {
    this.dateData = this.globalService.GetDate();
    this.timeReport = this.CheckTime(this.dateData.decHour) + ":" + this.CheckTime(this.dateData.decMinute) + ":" + this.CheckTime(this.dateData.decSec);
    this.txtTimeNow = this.timeReport + " " + this.dateData.szAMPM;
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

  public SaveOutsideRequest() {
    if (this.globalService.isArrived) {
      this.timeArrived = this.timeReport;
      this.timeReturn = "00:00:00"
      this.MappingData(ActivityId.AC003, this.timeArrived, this.timeReturn);

    } else {
      this.timeArrived = "00:00:00";
      this.timeReturn = this.timeReport;
      this.MappingData(ActivityId.AC004, this.timeArrived, this.timeReturn);
    }
  }

  private MappingData(szActivityId: string, timeArrived: string, timeReturn: string) {
    var requestData = new RequestData();
    requestData.szactivityid = szActivityId; // Datang Diluar
    requestData.szUserId = this.globalService.userData.szUserId;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = "";
    requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = this.ReturnDecTotal();
    requestData.szReasonImage = this.dataimage;
    requestData.bActiveRequest = true;
    this.globalService.SaveRequest(requestData, this.dateData);

    var reportData = new ReportData();
    reportData.timeArrived = timeArrived;
    reportData.timeValidArrived = timeArrived;
    reportData.timeReturn = timeReturn;
    reportData.timeValidReturn = timeReturn;
    reportData.szUserId = this.globalService.userData.szUserId;
    reportData.dateAbsen = this.dateData.date.toDateString();
    this.globalService.SaveReportData(reportData);
    return { requestData, reportData };
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
    // console.log(decMinute);
    // console.log(decHour + "." + decMinute);
    // console.log(decMinute);

    return decHour + "." + decMinute;
  }

  TakePhotos() {
    // this.globalService.TakePhotos();
    // this.photo = this.globalService.photo;
    // this.dataimage = this.globalService.dataimage;
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
      this.dataimage = imageData ;
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

}
