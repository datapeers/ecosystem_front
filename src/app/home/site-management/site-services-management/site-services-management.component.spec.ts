import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteServicesManagementComponent } from './site-services-management.component';

describe('SiteServicesManagementComponent', () => {
  let component: SiteServicesManagementComponent;
  let fixture: ComponentFixture<SiteServicesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteServicesManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteServicesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
