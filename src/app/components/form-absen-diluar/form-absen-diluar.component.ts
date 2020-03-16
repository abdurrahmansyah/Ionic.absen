import { Component, OnInit } from '@angular/core';
import { ActivityId, StatusId, GlobalService, RequestData, ReportData } from 'src/app/services/global.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  private loading: any;

  constructor(private camera: Camera,
    private alertController: AlertController,
    private globalService: GlobalService,
    private loadingController: LoadingController,
    public router: Router) {
    this.InitializeLoadingCtrl();
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
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

    if (!this.dataimage) {
      throw new Error("Foto wajib diisi.");
    }
  }

  private SaveRequestData(szActivityId: string) {
    this.PresentLoading();
    this.byPassSaveReportData();

    // var requestData = new RequestData();
    // requestData.szUserId = this.globalService.userData.szToken;
    // requestData.dateRequest = this.globalService.dateRequest;
    // requestData.timeRequest = this.globalService.timeRequest;
    // requestData.szActivityId = szActivityId;
    // requestData.szDesc = this.txtDesc;
    // requestData.szLocation = this.globalService.geoLatitude + ", " + this.globalService.geoLongitude;
    // // requestData.szStatusId = StatusId.ST003;
    // requestData.decTotal = "";
    // requestData.szReasonImage = this.dataimage;
    // // requestData.bActiveRequest = true;
    // this.globalService.SaveRequestData(requestData);
  }

  byPassSaveReportData() {
    var reportData = new ReportData();
    reportData.szUserId = this.globalService.userData.szToken;
    reportData.dateAbsen = this.globalService.dateRequest;
    reportData.timeAbsen = this.globalService.timeRequest;
    reportData.szImage = this.dataimage;
    reportData.szActivityId = this.globalService.diluarKantor;
    reportData.szDesc = this.txtDesc;
    reportData.isRequest = "1";

    var data = this.globalService.SaveReportDataWithRequest(reportData);
    this.SubscribeGetReportDatas(data);
  }

  private async SubscribeGetReportDatas(data: Observable<any>) {
    data.subscribe(data => {
      if (data.response == "success") {
        this.loadingController.dismiss();
        this.router.navigate(['home']);

        if (this.globalService.diluarKantor == this.globalService.activityDataList.datangDiluarKantor.id)
          this.PresentNotif(true);
        else
          this.PresentNotif(false);
        // this.globalService.PresentToast("Berhasil melakukan absensi");
      }
      else {
        this.loadingController.dismiss();
        this.globalService.PresentToast("Gagal melakukan absensi");
      }
    });
  }

  private async PresentNotif(isArrived: boolean) {
    await this.alertController.create({
      mode: 'ios',
      message: 'This is an alert message.',
      cssClass: isArrived ? 'alert-ontime' : 'alert-pulang',
      buttons: [{
        text: 'OK',
        role: 'Cancel'
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  public TakePhotos() {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
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

  async PresentLoading() {
    await this.loading.present();
  }
}
