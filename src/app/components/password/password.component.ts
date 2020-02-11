import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  public ClosePassword() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public OnChangeCurrentPassword(){
    console.log(this.currentPassword);
    
  }
}
