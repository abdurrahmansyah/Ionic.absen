import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { ComponentsModule } from '../components/components.module';
import { PopoverComponent } from '../components/popover/popover.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ PopoverComponent ],
  declarations: [HomePage],
  exports: [HomePage]
})
export class HomePageModule { }
