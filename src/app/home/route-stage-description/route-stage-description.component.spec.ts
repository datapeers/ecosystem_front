import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteStageDescriptionComponent } from './route-stage-description.component';

describe('RouteStageDescriptionComponent', () => {
  let component: RouteStageDescriptionComponent;
  let fixture: ComponentFixture<RouteStageDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteStageDescriptionComponent]
    });
    fixture = TestBed.createComponent(RouteStageDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
