import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from './guards/login-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [LoginGuardService],
    data: {
      expectedRole: 'ADMIN',
    },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/user/user.module').then((m) => m.UserModule),
    canActivate: [LoginGuardService],
    data: {
      expectedRole: 'USER',
    },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'createAccount',
    loadChildren: () =>
      import('./pages/create-account/create-account.module').then(
        (m) => m.CreateAccountModule
      ),
  },
  {
    path: 'user/orders',
    loadChildren: () =>
      import('./pages/orders/orders.module').then((m) => m.OrdersModule),
    canActivate: [LoginGuardService],
    data: {
      expectedRole: 'USER',
    },
  },
  {
    path: 'user/basket',
    loadChildren: () =>
      import('./pages/basket/basket.module').then((m) => m.BasketModule),
    canActivate: [LoginGuardService],
    data: {
      expectedRole: 'USER',
    },
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/wrong-path-page/wrong-path-page.module').then(
        (m) => m.WrongPathPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuardService],
})
export class AppRoutingModule {}
