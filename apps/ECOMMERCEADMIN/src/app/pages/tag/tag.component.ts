import { Component } from '@angular/core';
import { TagCreateComponent } from '../../modules/tag/components/tag-create/tag-create.component';
import { TagListComponent } from '../../modules/tag/components/tag-list/tag-list.component';

@Component({
  selector: 'app-tag',
  imports: [
    TagCreateComponent,
    TagListComponent
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent { }
