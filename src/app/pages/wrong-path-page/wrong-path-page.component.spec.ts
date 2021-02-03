import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongPathPageComponent } from './wrong-path-page.component';

describe('WrongPathPageComponent', () => {
  let component: WrongPathPageComponent;
  let fixture: ComponentFixture<WrongPathPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrongPathPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongPathPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
