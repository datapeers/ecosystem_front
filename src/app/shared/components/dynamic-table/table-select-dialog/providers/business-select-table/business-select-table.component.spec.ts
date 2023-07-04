import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSelectTableComponent } from './business-select-table.component';

describe('BusinessSelectTableComponent', () => {
  let component: BusinessSelectTableComponent;
  let fixture: ComponentFixture<BusinessSelectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessSelectTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
