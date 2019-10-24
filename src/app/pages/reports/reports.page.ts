import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, AlertController, IonSlides, Config, ActionSheetController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  segment = 0;
  popoverParam: any;
  isSegment0: boolean = true;

  constructor(private popoverController: PopoverController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actionSheetController: ActionSheetController) {
  }

  ngOnInit() {
    this.SetFirstSlideBySegment();
  }

  async SetFirstSlideBySegment() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.segment = this.router.getCurrentNavigation().extras.state.indexReport;
      }
    });

    await this.slider.slideTo(this.segment);
  }

  async SegmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async SlideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  async AddNewRequest() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Add New Request',
      mode: "ios",
      buttons: [this.IsLembur() ? {
        text: 'Lembur',
        handler: () => {
          console.log('Delete clicked');
        }
      } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { console.log('Cancel clicked'); }
        }, this.IsTerlambat() ? {
          text: 'Terlambat',
          handler: () => {
            console.log('Share clicked');
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { console.log('Cancel clicked'); }
        }, this.IsDatangDiluarKantor() ? {
          text: 'Datang diluar kantor',
          handler: () => {
            console.log('Play clicked');
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { console.log('Cancel clicked'); }
        }, this.IsPulangDiluarKantor() ? {
          text: 'Pulang diluar kantor',
          handler: () => {
            console.log('Favorite clicked');
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { console.log('Cancel clicked'); }
        }
      ]
    });

    var isValidToShow: boolean = false;
    actionSheet.buttons.forEach((x: any) => {
      if (!x.role) {
        isValidToShow = true;
      }
    });

    if (isValidToShow) await actionSheet.present();
  }

  IsLembur(): boolean {
    return false;
  }

  IsTerlambat(): boolean {
    return true;
  }

  IsDatangDiluarKantor(): boolean {
    return true;
  }

  IsPulangDiluarKantor(): boolean {
    return false;
  }
}