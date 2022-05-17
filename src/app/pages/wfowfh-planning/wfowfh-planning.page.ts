import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateData, GlobalService, WFOWFHPlanData } from 'src/app/services/global.service';

@Component({
  selector: 'app-wfowfh-planning',
  templateUrl: './wfowfh-planning.page.html',
  styleUrls: ['./wfowfh-planning.page.scss'],
})
export class WfowfhPlanningPage implements OnInit {
  public index: string;
  public wfowfhPlanDataList: any;
  credentials: FormGroup;
  public lokasi: string;
  dates = [];

  constructor(private fb: FormBuilder,
    private globalService: GlobalService) {
    this.lokasi = "1";
    this.InitializeData();
  }

  InitializeData() {
    this.InitializeDate();

  }

  InitializeDate() {
    this.wfowfhPlanDataList = this.globalService.wfowfhPlanDataList;
    this.InitializeWFOWFHPlanDate();
  }

  private InitializeWFOWFHPlanDate() {
    var activeDateCategory = this.globalService.dateCategoryDataList.find(x => x.status == this.globalService.statusDateCategory.ACTIVE);
    var start_date = activeDateCategory.start_date;
    var year_start = activeDateCategory.start_date.split('-')[0];
    var month_start = activeDateCategory.start_date.split('-')[1];
    var day_start = activeDateCategory.start_date.split('-')[2];
    console.log(start_date);
    console.log(year_start);
    console.log(month_start);
    console.log(day_start); ``;

    var end_date = activeDateCategory.end_date;
    var year_end = activeDateCategory.end_date.split('-')[0];
    var month_end = activeDateCategory.end_date.split('-')[1];
    var day_end = activeDateCategory.end_date.split('-')[2];
    console.log(end_date);
    console.log(year_end);
    console.log(month_end);
    console.log(day_end);

    var number = 0;
    if (month_start != month_end) {
      var maxDayInMonthStart = new Date(year_start, month_start, 0).getDate();
      for (let i = +day_start; i <= maxDayInMonthStart; i++) {
        var wfowfhPlanData = new WFOWFHPlanData();
        var day = i < 10 ? "0" + i : i;

        // wfowfhPlanData.number = number++;
        wfowfhPlanData.date = year_start + "-" + month_start + "-" + day;
        this.wfowfhPlanDataList.push(wfowfhPlanData);
      }

      for (let i = 1; i <= day_end; i++) {
        var wfowfhPlanData = new WFOWFHPlanData();
        var day = i < 10 ? "0" + i : i;

        // wfowfhPlanData.number = number++;
        wfowfhPlanData.date = year_end + "-" + month_end + "-" + day;
        this.wfowfhPlanDataList.push(wfowfhPlanData);
      }
    } else if (month_start == month_end) {
      for (let i = +day_start; i <= day_end; i++) {
        var wfowfhPlanData = new WFOWFHPlanData();
        var day = i < 10 ? "0" + i : i;

        // wfowfhPlanData.number = number++;
        wfowfhPlanData.date = year_start + "-" + month_start + "-" + day;
        this.wfowfhPlanDataList.push(wfowfhPlanData);
      }
    } else
      console.log("BUG: Date Not Valid");

    console.log(this.wfowfhPlanDataList);
    // console.log(this.number);

    this.globalService.wfowfhPlanDataList = this.wfowfhPlanDataList;
  }

  public CekModel() {
    console.log(this.wfowfhPlanDataList[0].index);
    console.log(this.wfowfhPlanDataList[1].index);
    console.log(this.wfowfhPlanDataList[2].index);
    console.log(this.wfowfhPlanDataList[3].index);
    console.log(this.wfowfhPlanDataList[4].index);
    console.log(this.wfowfhPlanDataList[5].index);
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      tujuan: ['', [Validators.required]],
      rincian: ['', [Validators.required]],
      lampiran: ['', [Validators.required]],
    });
  }

  get name() {
    return this.credentials.get('name');
  }

  get tujuan() {
    return this.credentials.get('tujuan');
  }

  get rincian() {
    return this.credentials.get('rincian');
  }

  get lampiran() {
    return this.credentials.get('lampiran');
  }

  async PermohonanInformasi() {
    console.log("OKEEE");
  }
}
