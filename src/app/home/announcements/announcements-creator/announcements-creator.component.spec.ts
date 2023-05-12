import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementsCreatorComponent } from './announcements-creator.component';

describe('AnnouncementsCreatorComponent', () => {
  let component: AnnouncementsCreatorComponent;
  let fixture: ComponentFixture<AnnouncementsCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementsCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
