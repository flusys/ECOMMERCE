import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockBrandsComponent } from './block-brands.component';

describe('BlockBrandsComponent', () => {
  let component: BlockBrandsComponent;
  let fixture: ComponentFixture<BlockBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
