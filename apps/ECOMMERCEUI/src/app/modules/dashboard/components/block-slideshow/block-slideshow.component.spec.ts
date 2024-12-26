import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSlideshowComponent } from './block-slideshow.component';

describe('BlockSlideshowComponent', () => {
  let component: BlockSlideshowComponent;
  let fixture: ComponentFixture<BlockSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockSlideshowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
