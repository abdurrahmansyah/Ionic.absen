import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public result: any;
  data: Observable<any>;
  Username: string;
  Password: string;

  constructor(private router: Router,
    public navCtrl: NavController,
    public http: HttpClient,
private storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController,
     private authService: AuthenticationService) { }

  ngOnInit() {
  }

  navigateToHomePage() {
    var url = 'http://sihk.hutamakarya.com/apiabsen/loginabsen.php';
    let postdata = new FormData();
    postdata.append('username', this.Username);
    postdata.append('password', this.Password);

    //postdata.append('username','hendra');
    //postdata.append('password','admin');

    this.data = this.http.post(url, postdata);
    this.data.subscribe(data => {
      this.result = data;
      if (this.result.error == false) {
        this.storage.set('username', this.Username);
        this.storage.set('name', this.result.user.name);

        this.presentToast("Login Berhasil");
        this.authService.login();

        this.router.navigate(['home']);
      } 
      else { this.presentToast("Login Gagal"); }
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }
}
