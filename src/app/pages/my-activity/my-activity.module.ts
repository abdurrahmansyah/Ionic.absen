import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyActivityPage } from './my-activity.page';
import { CustomHeaderDirective } from 'src/app/directives/custom-header.directive';

const routes: Routes = [
  {
    path: '',
    component: MyActivityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyActivityPage, CustomHeaderDirective]
})
export class MyActivityPageModule {}
