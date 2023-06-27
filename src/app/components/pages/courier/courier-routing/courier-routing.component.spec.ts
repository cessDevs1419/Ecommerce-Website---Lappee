import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierRoutingComponent } from './courier-routing.component';

describe('CourierRoutingComponent', () => {
  let component: CourierRoutingComponent;
  let fixture: ComponentFixture<CourierRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierRoutingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
