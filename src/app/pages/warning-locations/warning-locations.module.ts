import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WarningLocationsPage } from './warning-locations.page';

const routes: Routes = [
  {
    path: '',
    component: WarningLocationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WarningLocationsPage]
})
export class WarningLocationsPageModule {}
