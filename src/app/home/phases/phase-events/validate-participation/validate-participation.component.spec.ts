import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateParticipationComponent } from './validate-participation.component';

describe('ValidateParticipationComponent', () => {
  let component: ValidateParticipationComponent;
  let fixture: ComponentFixture<ValidateParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateParticipationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
