import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfferModalComponent } from './create-offer-modal.component';

describe('CreateOfferModalComponent', () => {
  let component: CreateOfferModalComponent;
  let fixture: ComponentFixture<CreateOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
