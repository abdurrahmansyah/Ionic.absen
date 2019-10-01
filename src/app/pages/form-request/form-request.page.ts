import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityId } from 'src/app/services/global.service';

@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.page.html',
  styleUrls: ['./form-request.page.scss'],
})
export class FormRequestPage implements OnInit {

  AC005:boolean = false;
  AC002:boolean = false;
  AC004:boolean = false;
  constructor(public activatedRoute: ActivatedRoute,public router: Router) { }

  ngOnInit() {
    this.SetFormByIndex();
  }


  async SetFormByIndex() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        console.log(this.router.getCurrentNavigation().extras.state.indexForm);
        console.log("coba ini sih");
        this.AC005 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC005 ? true : false;
        this.AC002 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC002 ? true : false;
        this.AC004 = this.router.getCurrentNavigation().extras.state.indexForm == ActivityId.AC004 ? true : false;
      }
    });
  }
}
