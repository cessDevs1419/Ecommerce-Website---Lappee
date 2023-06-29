import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRoutingComponent } from './main-routing.component';

describe('MainRoutingComponent', () => {
  let component: MainRoutingComponent;
  let fixture: ComponentFixture<MainRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainRoutingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
