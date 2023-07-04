import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSelectDialogComponent } from './table-select-dialog.component';

describe('TableSelectDialogComponent', () => {
  let component: TableSelectDialogComponent;
  let fixture: ComponentFixture<TableSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSelectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
