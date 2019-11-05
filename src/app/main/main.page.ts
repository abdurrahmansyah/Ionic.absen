import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {
      index: 1,
      title: 'Notifications',
      icon: 'notifications-outline'
    },
    {
      index: 2,
      title: 'Report',
      icon: 'today'
    },
    {
      index: 3,
      title: 'Work Permit',
      icon: 'undo'
    },
    {
      index: 4,
      title: 'Logout',
      icon: 'power'
    }
  ];

  selectedPath: number;
  public txtUserId: string;
  public txtUserName: string;
  public txtDivisionName: string;
  public txtSectionName: string;

  constructor(private router: Router,
    private authService: AuthenticationService,
    private globalService: GlobalService) {
    this.Timer();
  }

  private Timer() {
    setInterval(function () {
      this.ShowFirstLoadData();
    }.bind(this), 500);
  }

  private ShowFirstLoadData() {
    this.txtUserId = this.globalService.userData.szUserId;
    this.txtUserName = this.globalService.userData.szFullName;
    this.txtDivisionName = this.globalService.userData.szDivisionName;
    this.txtSectionName = this.globalService.userData.szSectionName;
  }

  ngOnInit() { 
  }

  NavRouterMenu(index: number) {
    this.selectedPath = index;
    if (index == 1) {
      this.router.navigate(['notifications']);
    }
    else if (index == 2) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexReport: 1
        }
      };
      this.router.navigate(['reports'], navigationExtras);
    }
    else if (index == 4) {
      this.authService.logout();
    }
  }
}
