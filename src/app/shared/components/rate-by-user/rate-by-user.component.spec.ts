import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateByUserComponent } from './rate-by-user.component';

describe('RateByUserComponent', () => {
  let component: RateByUserComponent;
  let fixture: ComponentFixture<RateByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateByUserComponent]
    });
    fixture = TestBed.createComponent(RateByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
