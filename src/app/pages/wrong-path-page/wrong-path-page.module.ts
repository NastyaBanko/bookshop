import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrongPathPageRoutingModule } from './wrong-path-page-routing.module';
import { WrongPathPageComponent } from './wrong-path-page.component';

import { MatButtonModule } from '@angular/material/button';

import { ApplicationDirectivesModule } from './../../directives/ApplicationDirectivesModule';

@NgModule({
  declarations: [WrongPathPageComponent],
  imports: [
    CommonModule,
    WrongPathPageRoutingModule,
    MatButtonModule,
    ApplicationDirectivesModule,
  ],
})
export class WrongPathPageModule {}
