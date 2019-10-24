import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  public requestDatas = [];

  constructor(private storage: Storage,
    private globalService: GlobalService, ) { }

  ngOnInit() {
    this.ShowFirstLoadData();
  }

  async ShowFirstLoadData() {
    var szUserId = await this.storage.get('szUserId').then((x) => { return x });

    this.globalService.GetRequestDatasForNotifications(szUserId);
    this.requestDatas = this.globalService.requestDatas;
  }
}
