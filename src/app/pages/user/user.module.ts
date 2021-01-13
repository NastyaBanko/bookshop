import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class UserModule { }
