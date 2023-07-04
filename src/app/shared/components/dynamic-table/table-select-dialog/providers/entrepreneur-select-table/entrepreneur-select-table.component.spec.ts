import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurSelectTableComponent } from './entrepreneur-select-table.component';

describe('EntrepreneurSelectTableComponent', () => {
  let component: EntrepreneurSelectTableComponent;
  let fixture: ComponentFixture<EntrepreneurSelectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrepreneurSelectTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrepreneurSelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
