import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneursComponent } from './entrepreneurs.component';

describe('EntrepreneursComponent', () => {
  let component: EntrepreneursComponent;
  let fixture: ComponentFixture<EntrepreneursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrepreneursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrepreneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
