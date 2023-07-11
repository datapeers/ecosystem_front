import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAssignComponent } from './users-assign.component';

describe('UsersAssignComponent', () => {
  let component: UsersAssignComponent;
  let fixture: ComponentFixture<UsersAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAssignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
