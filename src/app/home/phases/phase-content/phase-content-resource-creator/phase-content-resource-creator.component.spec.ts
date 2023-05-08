import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseContentResourceCreatorComponent } from './phase-content-resource-creator.component';

describe('PhaseContentResourceCreatorComponent', () => {
  let component: PhaseContentResourceCreatorComponent;
  let fixture: ComponentFixture<PhaseContentResourceCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseContentResourceCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseContentResourceCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
