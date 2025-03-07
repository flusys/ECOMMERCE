import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { AuthApiService } from '../../modules/auth/services/auth-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  messageService = inject(MessageService);
  private authApiService = inject(AuthApiService);
  fb = inject(FormBuilder);

  userForm!: FormGroup;
  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: [''],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
    this.authApiService.myProfileInformation().subscribe((data) => {
      this.userForm.patchValue(data.data);
    });
  }


  onSubmit() {
    let formData = this.userForm.value;
    this.authApiService.updateProfile(formData).subscribe((data) => {
      this.messageService.add({ key:'tst', severity: 'success', summary: 'Success', detail: 'Profile updated successfully' });
    }
    );
  }

}
