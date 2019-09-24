import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  
  @ViewChild('slides', { static: true }) slider: IonSlides;
  segment = 0;

  constructor() { }

  ngOnInit() { }

  next() {
    this.slider.slideNext();
  }

  prev() {
    this.slider.slidePrev();
  }
}
