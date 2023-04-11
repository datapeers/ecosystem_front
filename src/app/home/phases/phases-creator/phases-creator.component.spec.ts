import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhasesCreatorComponent } from './phases-creator.component';

describe('PhasesCreatorComponent', () => {
  let component: PhasesCreatorComponent;
  let fixture: ComponentFixture<PhasesCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhasesCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhasesCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
