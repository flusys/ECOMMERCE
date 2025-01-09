import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryListComponent } from '../../modules/gallery/components/gallery-list/gallery-list.component';
import { GalleryCreateComponent } from '../../modules/gallery/components/gallery-create/gallery-create.component';

@Component({
  selector: 'app-gallery',
  imports: [
    GalleryCreateComponent,
    GalleryListComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {}
