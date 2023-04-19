import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninformComponent } from './signinform.component';

describe('SigninformComponent', () => {
  let component: SigninformComponent;
  let fixture: ComponentFixture<SigninformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
