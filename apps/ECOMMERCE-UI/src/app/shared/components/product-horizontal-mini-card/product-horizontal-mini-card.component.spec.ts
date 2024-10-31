import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHorizontalMiniCardComponent } from './product-horizontal-mini-card.component';

describe('ProductHorizontalMiniCardComponent', () => {
  let component: ProductHorizontalMiniCardComponent;
  let fixture: ComponentFixture<ProductHorizontalMiniCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductHorizontalMiniCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHorizontalMiniCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
