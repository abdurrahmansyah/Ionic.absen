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
  private dataimage: string;

  constructor(private camera: Camera,
    private alertController: AlertController,
    private globalService: GlobalService) {
  }

  ngOnInit() {
    this.txtTimeRequest = this.globalService.timeRequest;
  }

  public SaveOutsideRequest() {
    try {
      this.ValidateData();

      if (this.globalService.isArrived) {
        this.SaveRequestData(this.globalService.activityDataList.datangDiluarKantor.id);
      }
      else {
        this.SaveRequestData(this.globalService.activityDataList.pulangDiluarKantor.id);
      }
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

    // if (!this.dataimage) {
    //   throw new Error("Foto wajib diisi.");
    // }
  }

  private SaveRequestData(szActivityId: string) {
    var requestData = new RequestData();
    requestData.szUserId = this.globalService.userData.szToken;
    requestData.dateRequest = this.globalService.dateRequest;
    requestData.timeRequest = this.globalService.timeRequest;
    requestData.szActivityId = szActivityId;
    requestData.szDesc = this.txtDesc;
    requestData.szLocation = this.globalService.geoLatitude + ", " + this.globalService.geoLongitude;
    // requestData.szStatusId = StatusId.ST003;
    requestData.decTotal = "";
    requestData.szReasonImage = this.dataimage;
    requestData.bActiveRequest = true;
    this.globalService.SaveRequestData(requestData);
  }

  public TakePhotos() {
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
