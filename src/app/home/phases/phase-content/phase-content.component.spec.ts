import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseContentComponent } from './phase-content.component';

describe('PhaseContentComponent', () => {
  let component: PhaseContentComponent;
  let fixture: ComponentFixture<PhaseContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
