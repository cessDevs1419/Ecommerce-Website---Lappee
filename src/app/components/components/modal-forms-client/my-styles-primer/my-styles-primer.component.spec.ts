import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStylesPrimerComponent } from './my-styles-primer.component';

describe('MyStylesPrimerComponent', () => {
  let component: MyStylesPrimerComponent;
  let fixture: ComponentFixture<MyStylesPrimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyStylesPrimerComponent]
    });
    fixture = TestBed.createComponent(MyStylesPrimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
