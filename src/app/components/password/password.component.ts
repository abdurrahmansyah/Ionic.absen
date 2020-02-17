import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  colorButton: string = "hk-red";
  loading: any;

  constructor(private modalController: ModalController,
    private loadingController: LoadingController,
    private globalService: GlobalService) {
    this.InitializeLoadingCtrl();
  }

  ngOnInit() { }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  public ClosePassword() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public OnChangeCurrentPassword() {
    this.ValidateForButton();
  }

  public OnChangeNewPassword() {
    this.ValidateForButton();
  }

  public OnConfirmNewPassword() {
    this.ValidateForButton();
  }

  public SavePassword() {
    try {
      if (this.ValidateForButton()) {
        this.PresentLoading();
        this.ValidatePassword();
        this.globalService.SavePassword(this.currentPassword, this.newPassword);
      }
    } catch (e) {
      this.loadingController.dismiss();
      this.globalService.PresentToast(e.message);
    }
  }

  private ValidateForButton(): boolean {
    if (this.currentPassword && this.newPassword && this.confirmPassword) {
      this.colorButton = "hk-white-red"
      return true;
    }
    else {
      this.colorButton = "hk-red";
      return false;
    }
  }

  private ValidatePassword() {
    if (this.newPassword != this.confirmPassword)
      throw new Error("Confirm password does not match");
  }

  async PresentLoading() {
    await this.loading.present();
  }
}
