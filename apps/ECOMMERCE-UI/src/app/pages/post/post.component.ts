import { Component } from '@angular/core';
import { AngularModule } from '../../shared/modules/angular.module';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

}
