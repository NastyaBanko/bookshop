import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
import { UpdateOfferComponent } from './components/update-offer/update-offer.component';
import { DeleteOfferModalComponent } from './components/delete-offer-modal/delete-offer-modal.component';
import { CreateOfferModalComponent } from './components/create-offer-modal/create-offer-modal.component';
import { DeleteCategoryModalComponent } from './components/delete-category-modal/delete-category-modal.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    AskModalComponent,
    OrderviewModalComponent,
    UpdateOfferComponent,
    DeleteOfferModalComponent,
    CreateOfferModalComponent,
    DeleteCategoryModalComponent,
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
    FormsModule,
    TextFieldModule,
    MatCardModule,
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}, MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
