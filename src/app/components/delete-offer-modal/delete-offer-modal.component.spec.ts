import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOfferModalComponent } from './delete-offer-modal.component';

describe('DeleteOfferModalComponent', () => {
  let component: DeleteOfferModalComponent;
  let fixture: ComponentFixture<DeleteOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
