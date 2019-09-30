import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormRequestPage } from './form-request.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormLemburComponent } from 'src/app/components/form-lembur/form-lembur.component';

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
  declarations: [FormRequestPage] , entryComponents: [FormLemburComponent]
})
export class FormRequestPageModule {}
