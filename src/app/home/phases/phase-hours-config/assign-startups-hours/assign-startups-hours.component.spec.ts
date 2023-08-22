import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStartupsHoursComponent } from './assign-startups-hours.component';

describe('AssignStartupsHoursComponent', () => {
  let component: AssignStartupsHoursComponent;
  let fixture: ComponentFixture<AssignStartupsHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignStartupsHoursComponent]
    });
    fixture = TestBed.createComponent(AssignStartupsHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
