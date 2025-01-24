import { Component, inject, model } from '@angular/core';
import { AngularModule } from '../../../shared/modules/angular.module';
import { MessageService } from 'primeng/api';
import { NewsletterApiService } from '../../../modules/newsleter/services/newsletter-api.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {
  messageService = inject(MessageService);
  newsletterApiService = inject(NewsletterApiService);

  email=model("");

  subscribe(){
    this.newsletterApiService.insert({email:this.email()}).subscribe(res=>{
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Success!',
        detail: 'Thanks for subscribe.',
      });
      this.email.set("");
    })
  }
}
