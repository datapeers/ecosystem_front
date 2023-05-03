import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiblesComponent } from './responsibles.component';

describe('ResponsiblesComponent', () => {
  let component: ResponsiblesComponent;
  let fixture: ComponentFixture<ResponsiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsiblesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
