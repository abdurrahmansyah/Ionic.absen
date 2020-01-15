import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttendancePage } from './attendance.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReportDailyComponent } from 'src/app/components/report-daily/report-daily.component';
import { ReportDaily2Component } from 'src/app/components/report-daily2/report-daily2.component';

const routes: Routes = [
  {
    path: '',
    component: AttendancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  entryComponents: [ ReportDailyComponent, ReportDaily2Component ],
  declarations: [AttendancePage]
})
export class AttendancePageModule {}
