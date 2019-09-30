import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, AlertController, IonSlides, Config } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  segment = 0;
  popoverParam: any;
  isSegment0: boolean = true;

  constructor(private popoverController: PopoverController,
    private activatedRoute: ActivatedRoute,
    private router: Router) { 
    }

  ngOnInit() {
    this.SetFirstSlideBySegment();
  }

  async SetFirstSlideBySegment() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.segment = this.router.getCurrentNavigation().extras.state.indexReport;
      }
    });

    await this.slider.slideTo(this.segment);
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
    
    // if(this.segment == 0){
    //   this.isSegment0 = true;
    // } else {
    //   this.isSegment0 = false;
    // }
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  // nanti dipindah di home // belom // cek
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: {
        popoverParam: this.popoverParam
      },
      event: ev,
      translucent: true,
      cssClass: 'pop-over-style'
    });

    popover.style.cssText = '--min-width: 80%';
    // popover.style.background = '--background: #000000';
    return await popover.present();
  }
}