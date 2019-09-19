import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, AlertController, IonSlides } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('slidesMonth', { static: true }) sliderMonth: IonSlides;
  segment = 0;
  pages: string;
  date: Date;
  
  slideOpts = {
    initialSlide: new Date().getMonth(),
    speed: 400
  };

  constructor(public popoverController: PopoverController) { }

  async ngOnInit() {
    var date = new Date();
    this.segment = 0;
    await this.slider.slideTo(this.segment);
    // await this.sliderMonth.slideTo(date.getMonth());
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'pop-over-style'
    });

    popover.style.cssText = '--min-width: 80%';
    // popover.style.background = '--background: #000000';
    return await popover.present();
  }

  next() {
    this.sliderMonth.slideNext();
  }

  prev() {
    this.sliderMonth.slidePrev();
  }

  onEventSelected() {

  }

  onViewTitleChanged() {

  }

  onTimeSelected() {

  }
}
