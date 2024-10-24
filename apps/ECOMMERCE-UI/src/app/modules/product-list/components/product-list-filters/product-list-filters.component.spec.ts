import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListFiltersComponent } from './product-list-filters.component';

describe('ProductListFiltersComponent', () => {
  let component: ProductListFiltersComponent;
  let fixture: ComponentFixture<ProductListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
