import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { WELCOME_KEY } from '../guards/welcome.guard';
import { USERDATA_KEY as USERDATA } from './global.service';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  // authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        console.log('auth token: ', JSON.stringify(res));
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
    })
  }

  login() {
    return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
      this.isAuthenticated.next(true);
    });
  }

  logout() {
    this.isAuthenticated.next(false);
    this.RemoveDataUser();
    this.storage.remove(USERDATA);
    this.storage.remove(WELCOME_KEY);
    this.storage.remove(TOKEN_KEY);
  }

  private RemoveDataUser() {
    this.storage.remove('md_user_token');
    // Storage.remove({ key: 'md_user_id' });
    // Storage.remove({ key: 'md_user_name' });
    // Storage.remove({ key: 'md_user_email' });
    // Storage.remove({ key: 'md_user_email_verified_at' });
    // Storage.remove({ key: 'md_user_telp' });
    // Storage.remove({ key: 'md_user_ktp' });
    // Storage.remove({ key: 'md_user_npwp' });
    // Storage.remove({ key: 'md_user_pekerjaan_id' });
    // Storage.remove({ key: 'md_user_address' });
    // Storage.remove({ key: 'md_user_instution' });
    // Storage.remove({ key: 'md_user_password' });
    // Storage.remove({ key: 'md_user_admin' });
    // Storage.remove({ key: 'md_user_status' });
    // Storage.remove({ key: 'md_user_date_created' });
    // Storage.remove({ key: 'md_user_date_modified' });
    // Storage.remove({ key: 'md_user_last_login' });
  }
}