import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseHomeworksComponent } from './phase-homeworks.component';

describe('PhaseHomeworksComponent', () => {
  let component: PhaseHomeworksComponent;
  let fixture: ComponentFixture<PhaseHomeworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseHomeworksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseHomeworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
