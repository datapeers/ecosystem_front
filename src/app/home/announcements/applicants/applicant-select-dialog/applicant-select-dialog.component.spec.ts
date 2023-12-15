import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSelectDialogComponent } from './applicant-select-dialog.component';

describe('ApplicantSelectDialogComponent', () => {
  let component: ApplicantSelectDialogComponent;
  let fixture: ComponentFixture<ApplicantSelectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantSelectDialogComponent]
    });
    fixture = TestBed.createComponent(ApplicantSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
