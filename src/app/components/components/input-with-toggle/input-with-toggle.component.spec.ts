import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithToggleComponent } from './input-with-toggle.component';

describe('InputWithToggleComponent', () => {
  let component: InputWithToggleComponent;
  let fixture: ComponentFixture<InputWithToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputWithToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputWithToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
