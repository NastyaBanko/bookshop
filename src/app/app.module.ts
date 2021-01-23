import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { AskModalComponent } from './components/ask-modal/ask-modal.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderviewModalComponent } from './components/orderview-modal/orderview-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AskModalComponent,
    OrderviewModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    MatDatepickerModule,
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}, MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
