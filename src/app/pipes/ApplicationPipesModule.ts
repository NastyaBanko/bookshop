import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReplaceCommaPipe } from './replaceComma.pipe';
import { RoundNumPipe } from './roundNum.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [ 
    ReplaceCommaPipe,
    RoundNumPipe,
  ],
  exports: [
    ReplaceCommaPipe,
    RoundNumPipe,
  ]
})
export class ApplicationPipesModule {}