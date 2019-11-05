import { Component, OnInit } from '@angular/core';
import { GlobalService, RequestData } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-report-daily2',
  templateUrl: './report-daily2.component.html',
  styleUrls: ['./report-daily2.component.scss'],
})
export class ReportDaily2Component implements OnInit {

  requestDatas = [];
  txtTimeArrived: string;
  txtTimeReturn: string;
  photo: string;

  constructor(
    private globalService: GlobalService,
    public http: HttpClient,
    private storage: Storage) {
    this.GetLoopRequestDatas();
  }

  ngOnInit() { }

  GetLoopRequestDatas() {
    setInterval(function () {
      this.GetRequestDatas();
    }.bind(this), 500);
  }

  GetRequestDatas() {
    this.requestDatas = this.globalService.requestDatas;
    this.txtTimeArrived = this.globalService.timeArrived;
    this.txtTimeReturn = this.globalService.timeReturn;
    // console.log(this.requestDatas);
    if(!this.requestDatas.map(x => x.szreasonimage).find(x => x) ||this.requestDatas.map(x => x.szreasonimage).find(x => x) =="undefined" ){
      this.photo="";
    }else{
      this.photo = 'data:image/jpeg;base64,' + this.requestDatas.map(x => x.szreasonimage).find(x => x);
      // console.log(this.photo);
      
    }
    
  }

  public DeleteRequest(szActivityId: string) {
    this.globalService.CloseRequestData(this.globalService.userData.szUserId, new Date().toLocaleString(), szActivityId);
  }
}
