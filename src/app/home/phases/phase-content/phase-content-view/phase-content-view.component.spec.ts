import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseContentViewComponent } from './phase-content-view.component';

describe('PhaseContentViewComponent', () => {
  let component: PhaseContentViewComponent;
  let fixture: ComponentFixture<PhaseContentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseContentViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
