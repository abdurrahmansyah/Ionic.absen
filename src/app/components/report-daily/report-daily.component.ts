import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { GlobalService, RequestData, ActivityId } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-report-daily',
  templateUrl: './report-daily.component.html',
  styleUrls: ['./report-daily.component.scss'],
})
export class ReportDailyComponent implements OnInit {
  @ViewChild('slidesMonth', { static: true }) sliderMonth: IonSlides;
  indexTurn = 0; // do not disturb
  public dtmNow = new Date();
  public decCurrentDay = this.dtmNow.getDate();
  public decCurrentMonth = this.dtmNow.getMonth() + 1;
  public decCurrentYear = this.dtmNow.getFullYear();
  public buttonPropertyDatas = [];
  public requestDatas = [];

  slideOpts = {
    initialSlide: new Date().getMonth(),
    speed: 400
  };
  data: any;
  result: any;
  txtTimeArrived: string;

  constructor(private globalService: GlobalService,
    private http: HttpClient, public storage: Storage) {
    this.GetRequestDatasForThisDay();
  }

  ngOnInit() {
    this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
    // this.globalService.requestDatas = [];
  }

  async slideMonthChanged() {
    if (this.indexTurn > 0) {
      this.decCurrentMonth = await this.sliderMonth.getActiveIndex() + 1;
      this.decCurrentDay = 1;
      this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
    }

    this.indexTurn++;
  }

  SetDataDaysInMonth(decMonth: number, decYear: number) {
    var totalDays = this.GetTotalDaysInMonth(decMonth, decYear);

    this.SetPropertyOfDataDaysInMonth(totalDays);
    this.SetCurrentDayToCenterPage();
  }

  GetTotalDaysInMonth(decMonth: number, decYear: number): number {
    return new Date(decYear, decMonth, 0).getDate();
  }

  private SetPropertyOfDataDaysInMonth(totalDays: number) {
    this.buttonPropertyDatas = [];

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
      this.GetRequestDatasForThisDay();
    }
  }

  async GetRequestDatasForThisDay() {
    var szUserId = await this.storage.get('szUserId').then((x) => { return x });
    var dateRequest = this.decCurrentYear + "/" + this.decCurrentMonth + "/" + this.decCurrentDay;
    
    this.globalService.GetRequestDatasByUserId(szUserId, dateRequest);
    this.requestDatas = this.globalService.requestDatas;
  }

  next() {
    this.sliderMonth.slideNext();
  }

  prev() {
    this.sliderMonth.slidePrev();
  }
}

class ButtonPropertyData {
  public date: number;
  public fill: string;
  public color: string;
}
