import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionStageRouteComponent } from './description-stage-route.component';

describe('DescriptionStageRouteComponent', () => {
  let component: DescriptionStageRouteComponent;
  let fixture: ComponentFixture<DescriptionStageRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionStageRouteComponent]
    });
    fixture = TestBed.createComponent(DescriptionStageRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
