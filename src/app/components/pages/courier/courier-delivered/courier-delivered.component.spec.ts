import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierDeliveredComponent } from './courier-delivered.component';

describe('CourierDeliveredComponent', () => {
  let component: CourierDeliveredComponent;
  let fixture: ComponentFixture<CourierDeliveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierDeliveredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
