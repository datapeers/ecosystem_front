import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseEvaluationsComponent } from './phase-evaluations.component';

describe('PhaseEvaluationsComponent', () => {
  let component: PhaseEvaluationsComponent;
  let fixture: ComponentFixture<PhaseEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseEvaluationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
