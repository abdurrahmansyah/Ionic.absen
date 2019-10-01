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
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRouter { }
