import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
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
      title: 'Logout',
      icon: 'power'
    }
  ];

  selectedPath: number;
  userData: []; // nanti dipindah ke global service
  public txtUserId: string;
  public txtUserName: string;
  public txtDivisionName: string;
  public txtSectionName: string;

  constructor(private router: Router, 
    private authService: AuthenticationService, 
    private http: HttpClient, 
    private storage: Storage,
    private globalService: GlobalService) {
    this.GetRequestDatasForThisDay();
  }

  ngOnInit() {
  }

  async GetRequestDatasForThisDay() {
    // var szUserId = await this.storage.get('szUserId').then((x) => { return x });
    var userData = await this.storage.get('userData').then((x) => { return x });
    console.log(userData);
    console.log(userData.szuserid);


    // var data = userData.find(x => x);
    // console.log(data);
    // console.log(data.szuserid);
    
    // this.GetUserData(szUserId);
    // this.globalService.GetRequestDatasByUserId(szUserId, dateRequest);
    // this.requestDatas = this.globalService.requestDatas;
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
    else if (index == 3) {
      this.authService.logout();
    }
  }

  public GetUserData(szUserId: string) {
    this.userData = [];
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetUserData.php';

    let postdata = new FormData();
    postdata.append('szUserId', szUserId);

    var data: any = this.http.post(url, postdata);
    data.subscribe(data => {
      if (data.error == false) {
        this.userData = data.result;
      }
      else {
        this.userData = [];
      }
      console.log(this.userData);
    });
  }
}
