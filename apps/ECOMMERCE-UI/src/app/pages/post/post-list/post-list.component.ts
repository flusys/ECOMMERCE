import { Component } from '@angular/core';
import { AngularModule } from '../../../shared/modules/angular.module';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    AngularModule,
    PostCardComponent
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {

}
