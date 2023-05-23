import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseHoursConfigComponent } from './phase-hours-config.component';

describe('PhaseHoursConfigComponent', () => {
  let component: PhaseHoursConfigComponent;
  let fixture: ComponentFixture<PhaseHoursConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseHoursConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseHoursConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
