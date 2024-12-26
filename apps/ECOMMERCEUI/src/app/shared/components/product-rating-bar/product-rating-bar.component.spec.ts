import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingBarComponent } from './product-rating-bar.component';

describe('ProductRatingBarComponent', () => {
  let component: ProductRatingBarComponent;
  let fixture: ComponentFixture<ProductRatingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRatingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
