import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './popover/popover.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportDailyComponent } from './report-daily/report-daily.component';
import { FormLemburComponent } from './form-lembur/form-lembur.component';



@NgModule({
  declarations: [PopoverComponent, ReportDailyComponent, FormLemburComponent],
  exports: [PopoverComponent, ReportDailyComponent, FormLemburComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
