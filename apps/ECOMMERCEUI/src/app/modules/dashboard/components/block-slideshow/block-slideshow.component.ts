import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnInit } from '@angular/core';
import { BannerStateService } from '../../services/banner-state.service';
import { CommonModule } from '@angular/common';
import { url } from 'node:inspector';

@Component({
  selector: 'app-block-slideshow',
  standalone: true,
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-slideshow.component.html',
  styleUrl: './block-slideshow.component.scss',
})
export class BlockSlideshowComponent {

  bannerStateService = inject(BannerStateService)
  slides: any[] = [];

  constructor() {
    effect(() => {
      const model = this.bannerStateService.select('data')() ?? undefined;
      if (model) {
        const data = model.result;
        this.slides = data.filter(res => res.type == 'top').map((res) => {
          return {
            id: res.id,
            image: res.image,
            mblImage: res.mblImage,
            title: res.title,
            subTitle: res.subTitle,
            url: res.url
          }
        });
      } else {
        this.slides = [];
      }
    });
  }
  clickBtn(url: string) {
    window.open(url);
  }

}
