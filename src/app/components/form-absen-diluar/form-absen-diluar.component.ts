import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivityId, StatusId, GlobalService, RequestData, DateData } from 'src/app/services/global.service';
import { NavController } from '@ionic/angular';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
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

  photos:any=[];
  constructor(public navCtrl: NavController, public file: File, private camera: Camera, private storage: Storage,
    private globalService: GlobalService) {
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

  public SaveLateRequest() {
    var requestData = new RequestData();
    requestData.szUserId = this.globalService.userData.szUserId;
    requestData.szactivityid = ActivityId.AC003;
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

  TakePhotos (){
    const options: CameraOptions = {
      quality:100,
      mediaType:this.camera.MediaType.PICTURE,
      destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.CAMERA,
      encodingType:this.camera.EncodingType.JPEG,
      targetWidth:500,
      targetHeight:500,
      allowEdit:true,
      saveToPhotoAlbum:true
    }
    
    this.camera.getPicture(options).then((imageData)=>{
      this.photos = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
     console.log("Camera issue:" + err);
    });

    }

}
