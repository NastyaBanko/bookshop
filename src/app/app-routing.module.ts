import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService }   from './login-guard.service';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), canActivate: [LoginGuardService], data: { 
    expectedRole: 'admin'}},
  { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule), canActivate: [LoginGuardService], data: { 
      expectedRole: 'user'} },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'createAccount', loadChildren: () => import('./pages/create-account/create-account.module').then(m => m.CreateAccountModule) },
  { path: 'user/orders', loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'user/basket', loadChildren: () => import('./pages/basket/basket.module').then(m => m.BasketModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuardService],
})
export class AppRoutingModule { }
