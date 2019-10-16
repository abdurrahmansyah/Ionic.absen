import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { GlobalService, RequestData } from 'src/app/services/global.service';
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
    private http: HttpClient, public storage: Storage, ) {
    this.GetRequestDatasForThisDay();
  }

  ngOnInit() {
    this.SetDataDaysInMonth(this.decCurrentMonth, this.decCurrentYear);
    this.globalService.requestDatas = [];
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
    this.GetRequestDatasFromDb();
    // this.MappingDummyRequestDatas(); // NANTI DIHAPUS
  }

  async GetRequestDatasFromDb() {
    this.requestDatas = [];
    this.globalService.timeBack="";
    this.globalService.timeArrived="";

    var szUserId = await this.storage.get('szUserId').then((x) => { return x });
    var url = 'http://sihk.hutamakarya.com/apiabsen/GetRequestData.php';
    var dtmRequest = this.decCurrentYear + "/" + this.decCurrentMonth + "/" + this.decCurrentDay;
    
    let postdata = new FormData();
    postdata.append('szUserId', szUserId);
    postdata.append('dtmRequest', dtmRequest);

    this.data = this.http.post(url, postdata);
    this.data.subscribe(data => {
      this.result = data;
      if (this.result.error == false) {
        //get api read 
        this.requestDatas = this.result.result;
        console.log(this.requestDatas.length);
        this.globalService.requestDatas = this.requestDatas;
        this.globalService.timeArrived = this.result.user.jam_datang_valid;
        this.globalService.timeBack = this.result.user.jam_pulang_valid;
      }
      else {
        this.requestDatas = [];
        this.globalService.requestDatas = this.requestDatas;
      }
    });

    //INI RENCANA AWAL LANGSUNG MASUKIN HASIL

    // this.http.post(url, postdata)
    //   .pipe(map((data): any => { return data; }))
    //   .subscribe((result) => {

    //     if (result.length > 0) {
    //       this.requestDatas = result.result;
    //       console.log(result);

    //     }
    //   });
  }

  // private MappingDummyRequestDatas() {
  //   var requestData = new RequestData();

  //   requestData.dtmRequest = new Date(this.decCurrentYear, this.decCurrentMonth, this.decCurrentDay);
  //   requestData.szActivityId = "AC005";
  //   requestData.szActivityName = "Lembur";
  //   requestData.szDesc = "Mengerjakan rundown acara 17 agustus";
  //   requestData.szLocation = "";
  //   requestData.szStatusId = "ST001";
  //   requestData.szStatusName = "Approved";
  //   requestData.decTotal = 1.56;
  //   this.requestDatas.push(requestData);

  //   requestData = new RequestData();
  //   requestData.dtmRequest = new Date();
  //   requestData.szActivityId = "AC003";
  //   requestData.szActivityName = "Diluar kantor";
  //   requestData.szDesc = "Meeting";
  //   requestData.szLocation = "Jalan Sisingamangaraja No 11, Menteng Timur, Jakarta Selatan";
  //   requestData.szStatusId = "ST003";
  //   requestData.szStatusName = "Need Approval";
  //   requestData.decTotal = 0;
  //   this.requestDatas.push(requestData);

  //   var requestData = new RequestData();
  //   requestData.dtmRequest = new Date();
  //   requestData.szActivityId = "AC005";
  //   requestData.szActivityName = "Lembur";
  //   requestData.szDesc = "Mengerjakan project absensi mobile";
  //   requestData.szLocation = "";
  //   requestData.szStatusId = "ST002";
  //   requestData.szStatusName = "Not Approved";
  //   requestData.decTotal = 3.45;
  //   this.requestDatas.push(requestData);
  //   this.globalService.requestDatas = this.requestDatas;
  // }

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
