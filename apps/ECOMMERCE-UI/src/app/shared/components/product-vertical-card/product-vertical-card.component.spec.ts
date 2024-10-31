import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVerticalCardComponent } from './product-vertical-card.component';

describe('ProductVerticalCardComponent', () => {
  let component: ProductVerticalCardComponent;
  let fixture: ComponentFixture<ProductVerticalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVerticalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVerticalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
