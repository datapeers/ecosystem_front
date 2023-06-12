import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseStartupsComponent } from './phase-startups.component';

describe('PhaseStartupsComponent', () => {
  let component: PhaseStartupsComponent;
  let fixture: ComponentFixture<PhaseStartupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseStartupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
