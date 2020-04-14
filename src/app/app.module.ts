import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { DatePipe } from '@angular/common';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

export let InjectorInstance: Injector;

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(
      {
        name: 'mobileabsensi_sql_lite',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
      }
    )],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    File,
    LocalNotifications,
    FCM,
    DatePipe,
    Diagnostic,
    InAppBrowser,
    OpenNativeSettings,
    NativeGeocoder,
    PhotoViewer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) 
  {
    InjectorInstance = this.injector;
  }
}
