import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityId, GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.page.html',
  styleUrls: ['./form-request.page.scss'],
})
export class FormRequestPage implements OnInit {

  isTerlambat: boolean = false;
  isDatangDiluarKantor: boolean = false;
  isPulangDiluarKantor: boolean = false;
  isPulangCepat: boolean = false;
  isLembur: boolean = false;
  constructor(public activatedRoute: ActivatedRoute, public router: Router, private globalService: GlobalService) { }

  ngOnInit() {
    this.SetFormByIndex();
  }

  private SetFormByIndex() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.isTerlambat = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.activityDataList.terlambat.id ? true : false;
        this.isDatangDiluarKantor = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.activityDataList.datangDiluarKantor.id ? true : false; // absen diluar
        this.isPulangDiluarKantor = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.activityDataList.pulangDiluarKantor.id ? true : false;
        this.isPulangCepat = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.activityDataList.pulangCepat.id ? true : false; // pulang cepat
        this.isLembur = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.activityDataList.lembur.id ? true : false; // lembur
      }
    });
  }
}
