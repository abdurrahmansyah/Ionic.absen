import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './popover/popover.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportDailyComponent } from './report-daily/report-daily.component';
import { FormLemburComponent } from './form-lembur/form-lembur.component';
import { FormAbsenDiluarComponent } from './form-absen-diluar/form-absen-diluar.component';
import { ReportMonthlyComponent } from './report-monthly/report-monthly.component';
import { ReportDaily2Component } from './report-daily2/report-daily2.component';
import { FormTerlambatComponent } from './form-terlambat/form-terlambat.component';
import { FormPulangCepatComponent } from './form-pulang-cepat/form-pulang-cepat.component';

@NgModule({
  declarations: [PopoverComponent, ReportDailyComponent, ReportDaily2Component, ReportMonthlyComponent, FormLemburComponent , FormAbsenDiluarComponent, FormTerlambatComponent, FormPulangCepatComponent],
  exports: [PopoverComponent, ReportDailyComponent, ReportDaily2Component, ReportMonthlyComponent, FormLemburComponent , FormAbsenDiluarComponent, FormTerlambatComponent , FormPulangCepatComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
