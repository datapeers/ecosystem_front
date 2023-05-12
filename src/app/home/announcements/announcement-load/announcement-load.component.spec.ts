import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementLoadComponent } from './announcement-load.component';

describe('AnnouncementLoadComponent', () => {
  let component: AnnouncementLoadComponent;
  let fixture: ComponentFixture<AnnouncementLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementLoadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
