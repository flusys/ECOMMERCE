import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockPostsComponent } from './block-posts.component';

describe('BlockPostsComponent', () => {
  let component: BlockPostsComponent;
  let fixture: ComponentFixture<BlockPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
