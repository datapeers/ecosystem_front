import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupInvitationComponent } from './startup-invitation.component';

describe('StartupInvitationComponent', () => {
  let component: StartupInvitationComponent;
  let fixture: ComponentFixture<StartupInvitationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartupInvitationComponent]
    });
    fixture = TestBed.createComponent(StartupInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
