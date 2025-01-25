import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, PLATFORM_ID, Renderer2, ViewChild, inject } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { PostApiService } from '../../services/post-api.service';

@Component({
  selector: 'app-block-posts',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-posts.component.html',
  styleUrl: './block-posts.component.scss'
})
export class BlockPostsComponent {
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  platformId = inject(PLATFORM_ID);
  slidesPerView = 4;
  spaceBetween = 20;

  postApiService = inject(PostApiService);
  postData: any[] = [];

  constructor() { }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
    }
    this.getAll()
  }

  getAll() {
    const select =  ['id', 'title', 'image', 'isHtml', 'description', 'category.name','createdAt', 'category.id'];
    const sort = { serial: 'ASC' as 'ASC' | 'DESC' };
    const pagination = {
      pageSize: 12,
      currentPage: 0
    }
    this.postApiService.getAll('', { select, sort, pagination }).subscribe((res) => {
      this.postData = res.result;
    });
  }


  updateSwiperSettings() {
    const width = window.innerWidth;
    if (width < 992) {
      this.slidesPerView = 1;
    } else {
      this.slidesPerView = 2;
    }
  }

  changeSlide(prevOrNext: number): void {
    if (prevOrNext === -1) {
      this.swiperRef.nativeElement.swiper.slidePrev();
    } else {
      this.swiperRef.nativeElement.swiper.slideNext();
    }
  }
}
