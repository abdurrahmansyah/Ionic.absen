import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WfowfhPlanningPage } from './wfowfh-planning.page';

const routes: Routes = [
  {
    path: '',
    component: WfowfhPlanningPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [WfowfhPlanningPage]
})
export class WfowfhPlanningPageModule {}
