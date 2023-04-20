import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhasesEditComponent } from './phases-edit.component';

describe('PhasesEditComponent', () => {
  let component: PhasesEditComponent;
  let fixture: ComponentFixture<PhasesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhasesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhasesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
