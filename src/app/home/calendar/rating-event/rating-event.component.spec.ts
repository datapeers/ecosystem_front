import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingEventComponent } from './rating-event.component';

describe('RatingEventComponent', () => {
  let component: RatingEventComponent;
  let fixture: ComponentFixture<RatingEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatingEventComponent]
    });
    fixture = TestBed.createComponent(RatingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
