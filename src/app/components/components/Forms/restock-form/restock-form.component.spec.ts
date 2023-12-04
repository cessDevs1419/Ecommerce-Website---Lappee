import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockFormComponent } from './restock-form.component';

describe('RestockFormComponent', () => {
  let component: RestockFormComponent;
  let fixture: ComponentFixture<RestockFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestockFormComponent]
    });
    fixture = TestBed.createComponent(RestockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
