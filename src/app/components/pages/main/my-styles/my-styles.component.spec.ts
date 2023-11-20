import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStylesComponent } from './my-styles.component';

describe('MyStylesComponent', () => {
  let component: MyStylesComponent;
  let fixture: ComponentFixture<MyStylesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyStylesComponent]
    });
    fixture = TestBed.createComponent(MyStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
