import { Component } from '@angular/core';
import { PrimeModule } from 'flusysng/shared/modules';
import { PostCategoryCreateComponent } from '../../modules/post/components/post-category-create/post-category-create.component';
import { PostCategoryListComponent } from '../../modules/post/components/post-category-list/post-category-list.component';
import { PostCreateComponent } from '../../modules/post/components/post-create/post-create.component';
import { PostListComponent } from '../../modules/post/components/post-list/post-list.component';

@Component({
  selector: 'app-post',
  imports: [
    PrimeModule,
    PostCategoryCreateComponent,
    PostCategoryListComponent,
    PostCreateComponent,
    PostListComponent
  ],
  templateUrl: './post.component.html',
})
export class PostComponent { }
