import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderviewModalComponent } from './orderview-modal.component';

describe('OrderviewModalComponent', () => {
  let component: OrderviewModalComponent;
  let fixture: ComponentFixture<OrderviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
