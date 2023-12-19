import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationUserComponent } from './evaluation-user.component';

describe('EvaluationUserComponent', () => {
  let component: EvaluationUserComponent;
  let fixture: ComponentFixture<EvaluationUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationUserComponent]
    });
    fixture = TestBed.createComponent(EvaluationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
