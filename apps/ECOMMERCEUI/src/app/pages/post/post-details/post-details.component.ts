import { Component } from '@angular/core';
import { AngularModule } from '../../../shared/modules/angular.module';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    AngularModule,
    PostCardComponent
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent {

}
