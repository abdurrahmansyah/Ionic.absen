import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

export const WELCOME_KEY = 'welcome-seen';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanLoad {
  constructor(private router: Router, private storage: Storage) {
  }

  async canLoad(): Promise<boolean> {
    var hasSeenWelcome = false;
    // this.storage.remove(WELCOME_KEY); // buat ngetes biar bisa masuk welcom

    this.storage.get(WELCOME_KEY).then(res => {
      hasSeenWelcome = res;
    });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasSeenWelcome) {
          resolve(true);
        } else {
          this.router.navigateByUrl('index/welcome', { replaceUrl: true });
          resolve(false);
        }
      }, 100);
    });
  }
}
