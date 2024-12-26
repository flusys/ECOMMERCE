import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockProductCarouselComponent } from './block-product-carousel.component';

describe('BlockProductCarouselComponent', () => {
  let component: BlockProductCarouselComponent;
  let fixture: ComponentFixture<BlockProductCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockProductCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockProductCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
