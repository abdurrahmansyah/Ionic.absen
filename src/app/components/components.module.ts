import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './popover/popover.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportDailyComponent } from './report-daily/report-daily.component';



@NgModule({
  declarations: [PopoverComponent, ReportDailyComponent],
  exports: [PopoverComponent, ReportDailyComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
