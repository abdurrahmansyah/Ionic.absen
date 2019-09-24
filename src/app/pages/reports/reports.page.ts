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
  indexActivity = 0; // do not disturb
  segment = 0;
  public buttonPropertyDatas = [];
  public dtmNow = new Date();
  public decCurrentDay = this.dtmNow.getDate();
  public decCurrentMonth = this.dtmNow.getMonth() + 1;
  public decCurrentYear = this.dtmNow.getFullYear();
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

    this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
  }

  SetDataDaysInMonth(decMonth: number, decYear: number) {
    var totalDays = this.GetTotalDaysInMonth(decMonth, decYear);

    this.buttonPropertyDatas = [];
    this.SetPropertyOfDataDaysInMonth(totalDays);
    this.SetCurrentDayToCenterPage();
  }

  GetTotalDaysInMonth(decMonth: number, decYear: number): number {
    return new Date(decYear, decMonth, 0).getDate();
  }

  private SetPropertyOfDataDaysInMonth(totalDays: number) {
    for (var i = 1; i <= totalDays; i++) {
      var buttonPropertyData = new ButtonPropertyData();
      buttonPropertyData.date = i;
      if (buttonPropertyData.date == this.decCurrentDay) {
        buttonPropertyData.color = "danger";
        buttonPropertyData.fill = "solid";
      }
      else {
        buttonPropertyData.color = "dark";
        buttonPropertyData.fill = "clear";
      }
      this.buttonPropertyDatas.push(buttonPropertyData);
    }
  }

  SetCurrentDayToCenterPage() {
    console.log("Method 'SetCurrentDayToCenterPage' not implemented yet.");
  }

  GetDayData(date: number) {
    if (this.decCurrentDay != date) {
      this.buttonPropertyDatas.forEach(element => {
        if (element.date == date) {
          element.color = "danger";
          element.fill = "solid";
        }
        if (element.date == this.decCurrentDay) {
          element.color = "dark";
          element.fill = "clear";
        }
      });

      this.decCurrentDay = date;
    }
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  async slideMonthChanged() {
    if (this.indexActivity > 0) {
      this.decCurrentMonth = await this.sliderMonth.getActiveIndex() + 1;
      this.decCurrentDay = 1;
      this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
    }

    this.indexActivity++;
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

class ReportData {
  public decCurrentDay: number;
  public decCurrentMonth: number;
  public decCurrentYear: number;

  constructor() { }

  public ReportData(decCurrentDay: number, decCurrentMonth: number, decCurrentYear: number) {
    this.decCurrentDay = decCurrentDay;
    this.decCurrentMonth = decCurrentMonth;
    this.decCurrentYear = decCurrentYear;
    return this.ReportData;
  }
}

class ButtonPropertyData {
  public date: number;
  public fill: string;
  public color: string;
}