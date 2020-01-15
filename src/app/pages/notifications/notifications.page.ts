import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService, RequestData, ActivityId, StatusId, ActivityData } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  public requestDatas = [];
  readonly approved = "approved";
  readonly reject = "reject";

  constructor(private storage: Storage,
    private globalService: GlobalService, private http: HttpClient) {
  }

  ngOnInit() {
    this.ShowFirstLoadData();
    // this.GetLoopRequestDatas();
  }

  private GetLoopRequestDatas() {
    var properID = 0;
    var refreshId = setInterval(function () {
      properID += 1;
      if (properID > 1) {
        console.log("done");
        clearInterval(refreshId);
      }
    }, 500);
  }

  private ShowFirstLoadData() {
    this.globalService.GetRequestDatasForNotifications();
    this.requestDatas = this.globalService.requestDatas;
    console.log(this.requestDatas);
  }

  public UpdateRequest(szRequestId: string, index: string) {
    var szStatusId = +index == 0 ? StatusId.ST002 : StatusId.ST001;
    this.globalService.UpdateRequestData(szRequestId, szStatusId);

    var idx = this.requestDatas.findIndex(x => x.szRequestId == szRequestId);
    this.requestDatas.splice(idx, 1);
  }

  public IsLate(szActivityId: string) {
    if (szActivityId == this.globalService.activityDataList.terlambat.id)
      return true;
  }

  public IsPulangCepat(szActivityId: string) {
    if (szActivityId == this.globalService.activityDataList.pulangCepat.id)
      return true;
  }

  public IsLembur(szActivityId: string) {
    if (szActivityId == this.globalService.activityDataList.lembur.id)
      return true;
  }

  public IsDatangDiluarKantor(szActivityId: string) {
    if (szActivityId == this.globalService.activityDataList.datangDiluarKantor.id)
      return true;
  }

  public IsPulangDiluarKantor(szActivityId: string) {
    if (szActivityId == this.globalService.activityDataList.pulangDiluarKantor.id)
      return true;
  }
}
