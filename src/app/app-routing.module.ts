import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexPageModule) },
  { path: '', loadChildren: () => import('./main/main.module').then(m => m.MainPageModule) },
  // {
  //   path: 'home',
  //   // loadChildren: './pages/login/login.module'
  //   loadChildren: './home/home.module'
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
