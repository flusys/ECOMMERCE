import { Component, ElementRef } from '@angular/core';
import { MenuStateService } from '../../services/menu-state.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {AppMenuitemComponent} from "@core/layout/components/app-sidebar/app.menuitem.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenuitemComponent],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss'
})
export class AppSidebarComponent {
  model: any[] = [];

  constructor(
    public el: ElementRef,
    private menuStateService: MenuStateService,
    private messageService: MessageService,
    private router: Router) {
  }

  ngOnInit() {
    this.model = this.menuStateService.getCurrentUserMenu();
    if (!this.menuStateService.checkUrl(this.router.url, this.model)) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: 'You are not authenticate for this menu.' });
      this.router.navigate(['/'])
    }
  }
}
