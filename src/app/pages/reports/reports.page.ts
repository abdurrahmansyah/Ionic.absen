import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { GlobalService, ActivityId } from 'src/app/services/global.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  segment = 0;
  isSegment0: boolean = true;
  isLeave: boolean = false;
  isSpecialLeave: boolean = false;
  isSick: boolean = false;
  isLate: boolean = false;
  isReturnEarly: boolean = false;
  isOvertime: boolean = false;

  constructor(private globalService: GlobalService,
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
    this.CheckValidActivitiesToShow();
    const actionSheet = await this.actionSheetController.create({
      header: 'Add New Request',
      mode: "ios",
      buttons: [this.isOvertime ? {
        text: 'Lembur',
        handler: () => {
          this.globalService.timeRequest = this.globalService.timeReturn;
          let navigationExtras: NavigationExtras = {
            state: {
              indexForm: ActivityId.AC006
            }
          }
          this.router.navigate(['form-request'], navigationExtras);
        }
      } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
        }, this.isLate ? {
          text: 'Terlambat',
          handler: () => {
            this.globalService.timeRequest = this.globalService.timeArrived;
            let navigationExtras: NavigationExtras = {
              state: {
                indexForm: ActivityId.AC002
              }
            }
            this.router.navigate(['form-request'], navigationExtras);
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
        }, this.isReturnEarly ? {
          text: 'Pulang Cepat',
          handler: () => {
            this.globalService.timeRequest = this.globalService.timeReturn;
            let navigationExtras: NavigationExtras = {
              state: {
                indexForm: ActivityId.AC005
              }
            }
            this.router.navigate(['form-request'], navigationExtras);
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
        }, this.isLeave ? {
          text: 'Izin Cuti',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              state: {
                indexForm: ActivityId.AC010
              }
            }
            this.router.navigate(['form-request'], navigationExtras);
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
        }, this.isSpecialLeave ? {
          text: 'Izin Khusus',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              state: {
                indexForm: ActivityId.AC009
              }
            }
            this.router.navigate(['form-request'], navigationExtras);
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
        }, this.isSick ? {
          text: 'Sakit',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              state: {
                indexForm: ActivityId.AC008
              }
            }
            this.router.navigate(['form-request'], navigationExtras);
          }
        } : {
          text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
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

  CheckValidActivitiesToShow() {
    var listActivities = this.globalService.requestDatas.map(x => x.szactivityid);

    if (!this.globalService.timeArrived && "bukan weekend") {
      this.isSick = true;
      this.isLeave = true;
      this.isSpecialLeave = true;
    }

    if (this.globalService.timeArrived > "08:10:00" && !listActivities.includes(ActivityId.AC002) && !listActivities.includes(ActivityId.AC003))
      this.isLate = true;
    if (this.globalService.timeReturn < "17:00:00" && !listActivities.includes(ActivityId.AC005) && !listActivities.includes(ActivityId.AC004))
      this.isReturnEarly = true;
    if (this.globalService.timeReturn > "17:45:00" && !listActivities.includes(ActivityId.AC006))
      this.isOvertime = true;
  }
}