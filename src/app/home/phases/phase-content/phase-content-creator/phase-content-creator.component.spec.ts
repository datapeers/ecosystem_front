import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseContentCreatorComponent } from './phase-content-creator.component';

describe('PhaseContentCreatorComponent', () => {
  let component: PhaseContentCreatorComponent;
  let fixture: ComponentFixture<PhaseContentCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseContentCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseContentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
