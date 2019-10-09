import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-terlambat',
  templateUrl: './form-terlambat.component.html',
  styleUrls: ['./form-terlambat.component.scss'],
})
export class FormTerlambatComponent implements OnInit {
  public result: any;
  public txtTimeNow: string;
  data: Observable<any>;
  timeArrived: string;
  szDesc: string;
  szUserId: string;

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public http: HttpClient,
    private storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController,
  ) { 
    this.GetStorage();
  }

  ngOnInit() {
  }

  async GetStorage() {
    //Fungsi untuk mengambil value pada local storage
    await this.storage.get('szUserId').then((szUserId) => {
      this.szUserId = szUserId;
    });

    await this.storage.get('saveTimeArrived').then((timeNow) => {
      this.txtTimeNow = timeNow;
    });
  }

  submitLate() {
    var date = new Date();
    var txtDate = date.getFullYear() + "/" + ( date.getMonth() + 1 ) + "/" + date.getDay() ;
    var url = 'http://sihk.hutamakarya.com/apiabsen/formrequest.php';
    let postdata = new FormData();
    var jamplg = "00:00:00"
    // var dtmRequest = txtDate + " " + this.txtTimeNow;

    postdata.append('jamdtvld', this.txtTimeNow);
    postdata.append('szUserId', this.szUserId);
    postdata.append('jamdt', this.txtTimeNow);
    postdata.append('jamdtvld', this.txtTimeNow);
    postdata.append('jamplg', jamplg);
    postdata.append('jamplgvld', jamplg);
    // postdata.append('tanggal', txtDate);
    // postdata.append('szDesc', this.szDesc);
    // postdata.append('szUserId', this.szUserId);
    // postdata.append('dtmRequest',dtmRequest);

    this.data = this.http.post(url, postdata);
    this.data.subscribe(data => {
      this.result = data;
      if (this.result.error == false) {
        console.log('MASUK');
        this.router.navigate(['home']);
      }
      else { console.log('GA MASUK');
       }
    });
    this.router.navigate(['home']);  
  }
}