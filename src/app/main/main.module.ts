import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MainPage } from './main.page';
import { MainRouter } from './main.router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainRouter
  ],
  declarations: [MainPage]
})
export class MainPageModule {}
