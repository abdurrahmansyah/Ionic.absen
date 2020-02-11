import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, LeaderboardData } from 'src/app/services/global.service';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.page.html',
  styleUrls: ['./leaderboards.page.scss'],
})
export class LeaderboardsPage implements OnInit {

  public photo: any;
  public leaderboardData1 = new LeaderboardData();
  public leaderboardData2 = new LeaderboardData();
  public leaderboardData3 = new LeaderboardData();
  public isThird: boolean = false;
  public isSecond: boolean = false;
  public isFirst: boolean = false;
  public leaderboardDataList1To3 = [];
  public leaderboardDataList4To5 = [];
  public leaderboardDataListRest = [];
  public length: any;

  constructor(public router: Router,
    public globalService: GlobalService) { 
      this.InitializeData();
    }

  ngOnInit() {
    this.photo = this.globalService.userData.szImage;
  }

  public BackToHome() {
    this.router.navigate(['home']);
  }

  ionViewWillEnter() {
    this.GetLeaderboardDataList();
  }

  DoRefresh(event: any) {
    this.GetLeaderboardDataList();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  private InitializeData() {
    // this.MappingDataDummy(1, this.leaderboardData1);
    // this.MappingDataDummy(2, this.leaderboardData2);
    // this.MappingDataDummy(3, this.leaderboardData3);
  }

  private MappingDataDummy(number: number, leaderboardData: LeaderboardData) {
    leaderboardData.number = number;
    leaderboardData.szUserName = "Belum ada data";
    leaderboardData.szDivisionName = "";
    leaderboardData.szImage = '';
  }

  private GetLeaderboardDataList() {
    var data = this.globalService.GetLeaderboardDataList();
    this.SubscribeGetLeaderboardDataList(data);
  }

  private SubscribeGetLeaderboardDataList(data) {
    data.subscribe(data => {
      if (data.response == "success") {
        var leaderboardDataFromDb = data.data;
        var leaderboardData = this.MappingLeaderboardDataFromDb(leaderboardDataFromDb);

        // console.log(leaderboardData);
      }
    });
  }

  private MappingLeaderboardDataFromDb(leaderboardDataFromDb: any) {
    var number = 1;

    leaderboardDataFromDb.forEach(ldrbrdData => {
      var leaderboardData = new LeaderboardData();
      var leaderboardDataList = [];

      if (number == 1) {
        number = this.MappingLeaderboardData(this.leaderboardDataList1To3, this.leaderboardData1, ldrbrdData, number);
        this.isFirst = true
      }
      else if (number == 2) {
        number = this.MappingLeaderboardData(this.leaderboardDataList1To3, this.leaderboardData2, ldrbrdData, number);
        this.isSecond = true
      }
      else if (number == 3) {
        number = this.MappingLeaderboardData(this.leaderboardDataList1To3, this.leaderboardData3, ldrbrdData, number);
        this.isThird = true
      }
      else if (number == 4 || number == 5) {
        number = this.MappingLeaderboardData(this.leaderboardDataList4To5, leaderboardData, ldrbrdData, number);
      }
      else if (number > 5) {
        number = this.MappingLeaderboardData(this.leaderboardDataListRest, leaderboardData, ldrbrdData, number);
      }
    });

    this.length = this.leaderboardDataListRest.length;
    // return leaderboardDataList;
    // return leaderboardDataList.find(x => x);
  }

  MappingLeaderboardData(leaderboardDataList: any[], leaderboardData: LeaderboardData, ldrbrdData: any, number: number) {
    leaderboardData.number = number++;
    leaderboardData.szUserId = ldrbrdData.nik;
    leaderboardData.szUserName = ldrbrdData.name;
    leaderboardData.szDivisionName = ldrbrdData.divisi;
    leaderboardData.szSectionName = ldrbrdData.department;
    leaderboardData.szSuperiorUserName = ldrbrdData.manager;
    leaderboardData.checkIn = ldrbrdData.check_in.split(' ')[1];
    leaderboardData.szImage = 'data:image/jpeg;base64,' + ldrbrdData.face_attach;
    leaderboardDataList.push(leaderboardData);

    return number;
  }
}
