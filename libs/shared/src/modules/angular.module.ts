import { CommonModule, DatePipe, NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";

@NgModule({
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    NgComponentOutlet
  ],
  providers: [
    DatePipe,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    NgComponentOutlet
  ],

})
export class AngularModule {
}
