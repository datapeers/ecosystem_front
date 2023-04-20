import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseLoadComponent } from './phase-load.component';

describe('PhaseLoadComponent', () => {
  let component: PhaseLoadComponent;
  let fixture: ComponentFixture<PhaseLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseLoadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
