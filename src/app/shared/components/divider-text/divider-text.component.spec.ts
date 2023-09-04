import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerTextComponent } from './divider-text.component';

describe('DividerTextComponent', () => {
  let component: DividerTextComponent;
  let fixture: ComponentFixture<DividerTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DividerTextComponent]
    });
    fixture = TestBed.createComponent(DividerTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
