import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsPage } from './reports.page';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { ReportDailyComponent } from 'src/app/components/report-daily/report-daily.component';
import { ReportDaily2Component } from 'src/app/components/report-daily2/report-daily2.component';
import { ReportMonthlyComponent } from 'src/app/components/report-monthly/report-monthly.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HttpClientModule,
  ],
  entryComponents: [ PopoverComponent, ReportDailyComponent, ReportDaily2Component, ReportMonthlyComponent ],
  declarations: [ReportsPage]
})
export class ReportsPageModule { }
