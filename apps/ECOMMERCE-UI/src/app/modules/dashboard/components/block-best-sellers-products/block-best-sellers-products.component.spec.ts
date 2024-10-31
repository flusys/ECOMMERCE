import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockBestSellersProductsComponent } from './block-best-sellers-products.component';

describe('BlockBestSellersProductsComponent', () => {
  let component: BlockBestSellersProductsComponent;
  let fixture: ComponentFixture<BlockBestSellersProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockBestSellersProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockBestSellersProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
