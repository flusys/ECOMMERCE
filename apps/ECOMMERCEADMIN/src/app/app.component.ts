import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PrimeModule } from 'flusysng/shared/modules';
import { ApiLoaderService } from "flusysng/core/services";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrimeModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiLoaderService = inject(ApiLoaderService);

  title: string = 'UMSADMIN';
}
