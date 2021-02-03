import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { WindowHeightDirective } from './windowHeight.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [ 
    WindowHeightDirective,
  ],
  exports: [
    WindowHeightDirective,
  ]
})
export class ApplicationDirectivesModule {}