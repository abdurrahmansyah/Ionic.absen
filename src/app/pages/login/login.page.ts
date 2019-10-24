import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../../services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public result: any;
  data: Observable<any>;
  szUserId: string;
  szPassword: string;
  Password: string;
  public userData = [];

  constructor(private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private globalService: GlobalService) { }

  ngOnInit() {
  }

  // Login() {
  //   var url = 'http://sihk.hutamakarya.com/apiabsen/loginabsen.php';
  //   let postdata = new FormData();
  //   postdata.append('szUserId', this.szUserId);
  //   postdata.append('password', this.Password);

  //   this.data = this.http.post(url, postdata);
  //   this.data.subscribe(data => {
  //     this.result = data;
  //     if (this.result.error == false) {
  //       this.storage.set('szUserId', this.szUserId);
  //       this.storage.set('szFullName', this.result.user.name); // edit
  //       this.storage.set('szShortName', this.result.user.name);
  //       this.storage.set('szImage', this.result.user.name);
  //       this.storage.set('szTitleId', this.result.user.name);
  //       this.storage.set('szDivisionId', this.result.user.name);
  //       this.storage.set('szSectionId', this.result.user.name);
  //       this.storage.set('szToUserId', this.result.user.name);

  //       this.PresentToast("Login Berhasil");
  //       this.authService.login();

  //       this.router.navigate(['home']);
  //     }
  //     else { this.PresentToast("Login Gagal"); }
  //   });
  // }

  Login() {
    this.globalService.GetUserData(this.szUserId, this.szPassword);
  }

  async PresentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }
}
