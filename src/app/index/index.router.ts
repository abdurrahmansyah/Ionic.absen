import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginGuard } from '../guards/auto-login.guard';
import { WelcomeGuard } from '../guards/welcome.guard';
import { IndexPage } from './index.page';

const routes: Routes = [
    {
        path: 'index',
        component: IndexPage,
        children: [
            {
                path: 'welcome',
                loadChildren: () => import('../pages/welcome/welcome.module').then(
                    m => m.WelcomePageModule
                ),
                canLoad: [AutoLoginGuard]
            },
            {
                path: 'login',
                loadChildren: () => import('../pages/login/login.module').then(
                    m => m.LoginPageModule
                ),
                canLoad: [WelcomeGuard, AutoLoginGuard]
            }
        ]
    },
    {
        path: '',
        redirectTo: 'index/login',
        pathMatch: 'full',
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndexRouter { }
