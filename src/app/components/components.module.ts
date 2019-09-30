import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './popover/popover.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportDailyComponent } from './report-daily/report-daily.component';
import { ReportMonthlyComponent } from './report-monthly/report-monthly.component';
import { ReportDaily2Component } from './report-daily2/report-daily2.component';



@NgModule({
  declarations: [PopoverComponent, ReportDailyComponent, ReportDaily2Component, ReportMonthlyComponent],
  exports: [PopoverComponent, ReportDailyComponent, ReportDaily2Component, ReportMonthlyComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
