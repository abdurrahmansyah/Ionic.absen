import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  public szUserId: any;
  public requestDatas = [];

  constructor(private storage: Storage,
    private globalService: GlobalService, ) { }

  ngOnInit() {
    this.ShowFirstLoadData();
  }

  async ShowFirstLoadData() {
    this.GetRequestByUser();
  }

  GetRequestByUser() {
  }
}
