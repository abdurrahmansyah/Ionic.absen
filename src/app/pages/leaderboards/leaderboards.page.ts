import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, LeaderboardData } from 'src/app/services/global.service';
import { LoadingController } from '@ionic/angular';

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
  private loading: any;
  private filter: string = 'WFO';
  private leaderboardDataFromDb: any;

  constructor(public router: Router,
    public globalService: GlobalService,
    private loadingController: LoadingController) {
    this.InitializeData();
    this.InitializeLoadingCtrl();
  }

  ngOnInit() {
    this.photo = this.globalService.userData.szImage;
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  public BackToHome() {
    this.router.navigate(['home']);
  }

  ionViewWillEnter() {
    this.PresentLoading();
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

  public LeaderboardWFO() {
    this.filter = 'WFO';
    this.MappingLeaderboardDataFromDb();
  }

  public LeaderboardWFOProyek() {
    this.filter = 'WFOProyek';
    this.MappingLeaderboardDataFromDb();
  }

  public LeaderboardWFH() {
    this.filter = 'WFH';
    this.MappingLeaderboardDataFromDb();
  }

  private GetLeaderboardDataList() {
    var data = this.globalService.GetLeaderboardDataListByWorkLocation(50);
    this.SubscribeGetLeaderboardDataList(data);
  }

  private SubscribeGetLeaderboardDataList(data) {
    data.subscribe(data => {
      if (data.response == "success") {
        var leaderboardDataFromDb = this.filter === 'WFO' ? data.data.wfo : this.filter === 'WFOProyek' ? data.data.wfoProyek : data.data.wfh;
        // this.MappingLeaderboardDataFromDb(leaderboardDataFromDb);
        this.leaderboardDataFromDb = data.data;
        this.MappingLeaderboardDataFromDb();

        this.loadingController.dismiss();
        // console.log(leaderboardData);
      }
      else
        this.loadingController.dismiss();
    });
  }

  private MappingLeaderboardDataFromDb() {
    var leaderboardDataFromDb = this.filter === 'WFO' ? this.leaderboardDataFromDb.wfo : this.filter === 'WFOProyek' ? this.leaderboardDataFromDb.wfoProyek : this.leaderboardDataFromDb.wfh;
    var number = 1;
    this.leaderboardDataList1To3 = [];
    this.leaderboardDataList4To5 = [];
    this.leaderboardDataListRest = [];
  

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
    leaderboardData.checkIn = ldrbrdData.check_in;
    leaderboardData.szImage = 'data:image/jpeg;base64,' + ldrbrdData.image;
    leaderboardDataList.push(leaderboardData);

    return number;
  }

  async PresentLoading() {
    await this.loading.present();
  }
}
