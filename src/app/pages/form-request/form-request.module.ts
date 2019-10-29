import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormRequestPage } from './form-request.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormLemburComponent } from 'src/app/components/form-lembur/form-lembur.component';
import { FormTerlambatComponent } from 'src/app/components/form-terlambat/form-terlambat.component';
import { FormAbsenDiluarComponent } from 'src/app/components/form-absen-diluar/form-absen-diluar.component';
import { FormPulangCepatComponent } from 'src/app/components/form-pulang-cepat/form-pulang-cepat.component';

const routes: Routes = [
  {
    path: '',
    component: FormRequestPage
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
  entryComponents: [FormLemburComponent, FormTerlambatComponent, FormAbsenDiluarComponent, FormPulangCepatComponent],
  declarations: [FormRequestPage]
})
export class FormRequestPageModule { }
