import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
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
                ),
                canLoad: [AuthGuard]
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
            },
            {
                path: 'attendance',
                loadChildren: () => import('../pages/attendance/attendance.module').then(
                    m => m.AttendancePageModule
                )
            },
            {
                path: 'leaderboards',
                loadChildren: () => import('../pages/leaderboards/leaderboards.module').then(
                    m => m.LeaderboardsPageModule
                )
            },
            {
                path: 'warning-locations',
                loadChildren: () => import('../pages/warning-locations/warning-locations.module').then(
                    m => m.WarningLocationsPageModule
                )
            },
            {
                path: 'warning-updates',
                loadChildren: () => import('../pages/warning-updates/warning-updates.module').then(
                    m => m.WarningUpdatesPageModule
                )
            },
            {
                path: 'my-activity',
                loadChildren: () => import('../pages/my-activity/my-activity.module').then(
                    m => m.MyActivityPageModule
                )
            },
            {
                path: 'team-activity',
                loadChildren: () => import('../pages/team-activity/team-activity.module').then(
                    m => m.TeamActivityPageModule
                )
            },
            {
                path: 'new-activity',
                loadChildren: () => import('../pages/new-activity/new-activity.module').then(
                    m => m.NewActivityPageModule
                )
            },
            {
                path: 'wfowfh-planning',
                loadChildren: () => import('../pages/wfowfh-planning/wfowfh-planning.module').then(
                    m => m.WfowfhPlanningPageModule
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
