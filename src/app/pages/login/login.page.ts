import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  szUserId: string;
  szPassword: string;
  passwordType: string = 'password';
  passwordShown: boolean = false;
  iconName: string = 'eye';
  segment: any;

  constructor(private globalService: GlobalService) {
    this.segment = "sso";
  }

  ngOnInit() { }

  public Login() {
    this.globalService.Login(this.szUserId, this.szPassword);
  }

  public LoginSSO() {
    this.szUserId = this.szUserId.toLowerCase();
    this.globalService.LoginSSO(this.szUserId, this.szPassword);
  }

  public togglePass() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
      this.iconName = 'eye';
    } else {
      this.passwordShown = true;
      this.passwordType = '';
      this.iconName = 'eye-off';
    }
  }

  public SegmentChanged(ev: any) {
    this.szUserId = "";
    this.szPassword = "";
  }
}