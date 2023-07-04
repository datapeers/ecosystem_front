import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupSelectTableComponent } from './startup-select-table.component';

describe('StartupSelectTableComponent', () => {
  let component: StartupSelectTableComponent;
  let fixture: ComponentFixture<StartupSelectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartupSelectTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartupSelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
