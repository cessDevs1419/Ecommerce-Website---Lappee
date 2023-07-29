import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingsInputComponent } from './star-ratings-input.component';

describe('StarRatingsInputComponent', () => {
  let component: StarRatingsInputComponent;
  let fixture: ComponentFixture<StarRatingsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarRatingsInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarRatingsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
