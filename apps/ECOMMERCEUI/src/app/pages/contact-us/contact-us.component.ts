import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactUsApiService } from '../../modules/contact-us/services/contactus-api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm!: FormGroup;
  contactusApiService = inject(ContactUsApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);


  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactusApiService.insert(this.contactForm.value).subscribe((res)=>{
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success!',
          detail: 'You contact submitted. We will reach you',
        });
        this.contactForm.reset()
      })
    }
  }
}
