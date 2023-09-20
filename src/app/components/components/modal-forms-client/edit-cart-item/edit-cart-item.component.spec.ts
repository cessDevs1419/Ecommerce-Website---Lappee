import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCartItemComponent } from './edit-cart-item.component';

describe('EditCartItemComponent', () => {
  let component: EditCartItemComponent;
  let fixture: ComponentFixture<EditCartItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCartItemComponent]
    });
    fixture = TestBed.createComponent(EditCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
