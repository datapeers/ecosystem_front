import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseHomeworkTableComponent } from './phase-homework-table.component';

describe('PhaseHomeworkTableComponent', () => {
  let component: PhaseHomeworkTableComponent;
  let fixture: ComponentFixture<PhaseHomeworkTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseHomeworkTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseHomeworkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
