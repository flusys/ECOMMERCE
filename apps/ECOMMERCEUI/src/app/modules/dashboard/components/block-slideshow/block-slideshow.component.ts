import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-block-slideshow',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-slideshow.component.html',
  styleUrl: './block-slideshow.component.scss',
})
export class BlockSlideshowComponent {
  slides = [
    {
      pcImage: 'images/slides/slide-1.jpg',
      mblImage: 'images/slides/slide-1-mobile.jpg',
      description: 'We will help you 1',
    },
    {
      pcImage: 'images/slides/slide-2.jpg',
      mblImage: 'images/slides/slide-2-mobile.jpg',
      description: 'We will help you 2',
    },
    {
      pcImage: 'images/slides/slide-3.jpg',
      mblImage: 'images/slides/slide-3-mobile.jpg',
      description: 'We will help you 3',
    },
  ];
}
