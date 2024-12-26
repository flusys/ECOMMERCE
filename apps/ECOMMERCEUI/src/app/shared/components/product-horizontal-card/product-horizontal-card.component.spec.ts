import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHorizontalCardComponent } from './product-horizontal-card.component';

describe('ProductHorizontalCardComponent', () => {
  let component: ProductHorizontalCardComponent;
  let fixture: ComponentFixture<ProductHorizontalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductHorizontalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHorizontalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
