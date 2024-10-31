import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockBannerComponent } from './block-banner.component';

describe('BlockBannerComponent', () => {
  let component: BlockBannerComponent;
  let fixture: ComponentFixture<BlockBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
