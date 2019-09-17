import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public result:any;
  data: Observable<any>;
  Username: string;
  Password: string;

  constructor(private router: Router,
    public navCtrl: NavController,
     public http: HttpClient,   
     public alertCtrl: AlertController, 
     private storage: Storage,
     private authService: AuthenticationService) { }

  ngOnInit() {
  }

  navigateToHomePage(){

    var titleText,subTitleText;
    var url = 'http://sihk.hutamakarya.com/apiabsen/loginabsen.php';
    let postdata = new FormData();
    postdata.append('username',this.Username);
    postdata.append('password',this.Password);
    
    //postdata.append('username','hendra');
    //postdata.append('password','admin');
    

    this.data = this.http.post(url, postdata);
    this.data.subscribe( data =>{
      this.result = data;
      if(this.result.error == false){
        this.storage.set('username', this.Username);
        this.storage.set('name', this.result.user.name);

        // titleText = "Login Berhasil";
        this.authService.login();

        subTitleText = "Login Berhasil : "+this.result.user.name;
        alert(subTitleText);
        this.router.navigate(['home']);
      }else{
        titleText = "Login Gagal";
        subTitleText = "Username dan Password tidak cocok";
        alert(subTitleText);
      }
      //  alert(titleText);

    });
    
  }
}
