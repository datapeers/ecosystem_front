import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseEventsComponent } from './phase-events.component';

describe('PhaseEventsComponent', () => {
  let component: PhaseEventsComponent;
  let fixture: ComponentFixture<PhaseEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
