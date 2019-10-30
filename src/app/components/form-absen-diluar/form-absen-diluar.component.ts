import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-form-absen-diluar',
  templateUrl: './form-absen-diluar.component.html',
  styleUrls: ['./form-absen-diluar.component.scss'],
})
export class FormAbsenDiluarComponent implements OnInit {

  photos:any=[];
  constructor(public navCtrl: NavController, public file: File, private camera: Camera) { }

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

  ngOnInit() {}

}
