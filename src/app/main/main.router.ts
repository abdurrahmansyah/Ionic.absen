import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './main.page';

const routes: Routes = [
    {
        path: '',
        component: MainPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.module').then(
                    m => m.HomePageModule
                )
            },
            {
                path: 'notifications',
                loadChildren: () => import('../pages/notifications/notifications.module').then(
                    m => m.NotificationsPageModule
                )
            },
            {
                path: 'reports',
                loadChildren: () => import('../pages/reports/reports.module').then(
                    m => m.ReportsPageModule
                )
            },
            {
                path: 'form-request',
                loadChildren: () => import('../pages/form-request/form-request.module').then(
                    m => m.FormRequestPageModule
                )
            },
            {
                path: 'settings',
                loadChildren: () => import('../pages/settings/settings.module').then(
                    m => m.SettingsPageModule
                )
            },
            {
                path: 'work-permit',
                loadChildren: () => import('../pages/work-permit/work-permit.module').then(
                    m => m.WorkPermitPageModule
                )
            }
            ,
            {
                path: 'attendance',
                loadChildren: () => import('../pages/attendance/attendance.module').then(
                    m => m.AttendancePageModule
                )
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRouter { }
