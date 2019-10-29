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

  constructor(private globalService: GlobalService) { }

  ngOnInit() { }

  public Login() {
    this.globalService.GetUserData(this.szUserId, this.szPassword);
  }
}
