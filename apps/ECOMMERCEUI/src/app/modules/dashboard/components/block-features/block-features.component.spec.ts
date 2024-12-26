import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockFeaturesComponent } from './block-features.component';

describe('BlockFeaturesComponent', () => {
  let component: BlockFeaturesComponent;
  let fixture: ComponentFixture<BlockFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
