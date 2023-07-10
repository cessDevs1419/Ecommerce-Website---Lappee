import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignParcelsFormComponent } from './assign-parcels-form.component';

describe('AssignParcelsFormComponent', () => {
  let component: AssignParcelsFormComponent;
  let fixture: ComponentFixture<AssignParcelsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignParcelsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignParcelsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
