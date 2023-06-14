import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantStateEditComponent } from './applicant-state-edit.component';

describe('ApplicantStateEditComponent', () => {
  let component: ApplicantStateEditComponent;
  let fixture: ComponentFixture<ApplicantStateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantStateEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantStateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
