import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockCategoriesComponent } from './block-categories.component';

describe('BlockCategoriesComponent', () => {
  let component: BlockCategoriesComponent;
  let fixture: ComponentFixture<BlockCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
