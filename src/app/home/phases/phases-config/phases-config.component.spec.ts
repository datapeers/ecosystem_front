import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhasesConfigComponent } from './phases-config.component';

describe('PhasesConfigComponent', () => {
  let component: PhasesConfigComponent;
  let fixture: ComponentFixture<PhasesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhasesConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhasesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
