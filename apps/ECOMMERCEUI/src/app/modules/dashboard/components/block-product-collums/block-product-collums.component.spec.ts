import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockProductCollumsComponent } from './block-product-collums.component';

describe('BlockProductCollumsComponent', () => {
  let component: BlockProductCollumsComponent;
  let fixture: ComponentFixture<BlockProductCollumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockProductCollumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockProductCollumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
