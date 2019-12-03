import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ModalController } from '@ionic/angular';
import { PasswordComponent } from 'src/app/components/password/password.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public txtUserId: string;
  constructor(private globalService: GlobalService,
    private modalController: ModalController) {
    this.txtUserId = this.globalService.userData.szUserId;
  }

  ngOnInit() {
  }

  public async UpdatePassword() {
    const modal = await this.modalController.create({
      component: PasswordComponent
    });
    return await modal.present();
  }
}