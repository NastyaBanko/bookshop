import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { CreateAccountRoutingModule } from './create-account-routing.module';
import { CreateAccountComponent } from './create-account.component';

import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    CreateAccountRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class CreateAccountModule { }
