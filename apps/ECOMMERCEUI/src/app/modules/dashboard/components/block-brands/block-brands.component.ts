import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { BrandApiService } from '../../services/brand-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-block-brands',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-brands.component.html',
  styleUrl: './block-brands.component.scss'
})
export class BlockBrandsComponent {
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  platformId = inject(PLATFORM_ID);
  slidesPerView = 4;
  spaceBetween = 20;


  brandApiService=inject(BrandApiService);
  brandData:any[]=[];  

  constructor() { }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
    }
    this.getAll()
  }

  getAll(){
    const select=['id','name','image'];
     this.brandApiService.getAll('',{select}).subscribe((res)=>{
      this.brandData=res.result;
     });
  }

  updateSwiperSettings() {
    const width = window.innerWidth;
    if (width < 576) {
      this.slidesPerView = 2;
    } else if (width < 768) {
      this.slidesPerView = 3;
    } else if (width < 992) {
      this.slidesPerView = 4;
    } else if (width < 1200) {
      this.slidesPerView = 5;
    } else {
      this.slidesPerView = 6;
    }
  }
}
