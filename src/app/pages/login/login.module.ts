import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class LoginModule { }
