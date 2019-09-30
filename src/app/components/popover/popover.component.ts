import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ActivityId } from 'src/app/services/global.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  popoverParam: any;
  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.popoverParam = this.navParams.get('popoverParam');

    if (this.popoverParam == ActivityId.AC005) {
      console.log("lembur");

    }
  }

}
