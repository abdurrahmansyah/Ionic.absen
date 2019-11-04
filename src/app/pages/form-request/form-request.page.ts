import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityId } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.page.html',
  styleUrls: ['./form-request.page.scss'],
})
export class FormRequestPage implements OnInit {

  AC002: boolean = false;
  AC003: boolean = false;
  AC004: boolean = false;
  AC005: boolean = false;
  AC006: boolean = false;
  constructor(public activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.SetFormByIndex();
  }

  private SetFormByIndex() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.AC002 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC002 ? true : false;
        this.AC003 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC003 ? true : false; // absen diluar
        this.AC004 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC004 ? true : false;
        this.AC005 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC005 ? true : false; // pulang cepat
        this.AC006 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC006 ? true : false; // lembur
      }
    });
  }
}
