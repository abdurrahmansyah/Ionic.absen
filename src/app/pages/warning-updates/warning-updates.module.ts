import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WarningUpdatesPage } from './warning-updates.page';

const routes: Routes = [
  {
    path: '',
    component: WarningUpdatesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WarningUpdatesPage]
})
export class WarningUpdatesPageModule {}
