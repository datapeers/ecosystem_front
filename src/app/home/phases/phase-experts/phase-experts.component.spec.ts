import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseExpertsComponent } from './phase-experts.component';

describe('PhaseExpertsComponent', () => {
  let component: PhaseExpertsComponent;
  let fixture: ComponentFixture<PhaseExpertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseExpertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
