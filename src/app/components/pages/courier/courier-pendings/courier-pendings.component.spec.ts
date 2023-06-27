import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierPendingsComponent } from './courier-pendings.component';

describe('CourierPendingsComponent', () => {
  let component: CourierPendingsComponent;
  let fixture: ComponentFixture<CourierPendingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierPendingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierPendingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
