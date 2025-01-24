import { Component, effect, inject } from '@angular/core';
import { BannerStateService } from '../../services/banner-state.service';

@Component({
  selector: 'app-block-banner',
  standalone: true,
  imports: [],
  templateUrl: './block-banner.component.html',
  styleUrl: './block-banner.component.scss'
})
export class BlockBannerComponent {
  bannerStateService = inject(BannerStateService)
  slide: any;

  constructor() {
    effect(() => {
      const model = this.bannerStateService.select('data')() ?? undefined;
      if (model) {
        const data = model.result;
        this.slide = data.filter(res => res.type == 'middle').map((res) => {
          return {
            image: res.image,
            mblImage: res.mblImage,
            title: res.title,
            subTitle: res.subTitle
          }
        })[0];
      } else {
        this.slide = undefined;
      }
    });
  }

  clickBtn(url:string){
    window.open(url);
  }
}
