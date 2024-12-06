import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthenticationFormService } from '../../service/authentication-form.service';
import { AuthenticationApiService } from '../../service/authentication-api.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AngularModule } from '@shared/modules/angular.module';
import { PrimeModule } from '@shared/modules/prime.module';
import { IRegisterForm } from '../../interface/authentication-form';
import { GenderDropdownComponent } from '@shared/components/gender-dropdown/gender-dropdown.component';
import { LineageFormService } from '@modules/lineage/services/lineage-form.service';
import { ILineageForm } from '@modules/lineage/interfaces/lineage-form';
import { take } from 'rxjs';
import { IReferCodeDetails } from '../../interface/refer-code-details.interface';
import { RoleEnum } from '@shared/enums/role.enum';
import { Router } from '@angular/router';
import { FileUploadService } from '@shared/services/file-upload.service';
import {OpenVerifierDialogDirective} from "flusysng/shared/directives";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AngularModule,
    PrimeModule,
    GenderDropdownComponent,
    OpenVerifierDialogDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [AuthenticationFormService, LineageFormService],
})
export class RegisterComponent implements OnInit {
  @Input() requestUrl!: string;
  @Input() referCode!: string;

  referCodeDetails!: IReferCodeDetails;
  agreed:boolean=false;

  constructor(
    private authenticationFormService: AuthenticationFormService,
    private authenticationApiService: AuthenticationApiService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.referCode) {
      this.authenticationApiService
        .getReferCodeDetails(this.referCode)
        .pipe(take(1))
        .subscribe((res) => {
          if (res.success) {
            this.referCodeDetails = res.result;
            this.lineageForm.patchValue({
              id: this.referCodeDetails.lineageId,
              name: this.referCodeDetails.lineageName,
            });
            this.registerForm.patchValue({
              referCode: this.referCode,
              role: RoleEnum.MEMBER,
            });
          } else {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'Sorry!',
              detail: res.message,
            });
          }
        });
    }
  }

  get value(): string {
    return this.authenticationFormService.registerForm.value.email ?? '';
  }

  get isVerified(): boolean {
    return (
      this.authenticationFormService.registerForm.value.isVerified ?? false
    );
  }

  setVerified(isVerified: boolean) {
    this.authenticationFormService.registerForm.patchValue({ isVerified });
  }

  callBackVerified(event: {
    message: string;
    isVerified: boolean;
    verifiedClientId: string;
  }) {
    this.setVerified(event.isVerified);
  }

  get isRefer() {
    if (this.referCodeDetails) return true;
    return false;
  }

  get isSameLineage() {
    if (this.referCodeDetails?.lineageId) return true;
    return false;
  }

  get geReferByName() {
    if (this.isRefer) return this.referCodeDetails?.referUserName;
    return '';
  }

  get registerForm(): FormGroup<IRegisterForm> {
    return this.authenticationFormService.registerForm;
  }

  get lineageForm(): FormGroup<ILineageForm> {
    return this.registerForm.get('lineage') as FormGroup<ILineageForm>;
  }

  register() {
    if (this.registerForm.invalid) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Something wrong in form validation.',
      });
    }

    if (!this.isVerified) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Your Email not verified. Please, Click verify Icon for Verify',
      });
    }

    if(!this.agreed){
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Please !',
        detail: 'Agree Terms & Condition .',
      });
    }

    const data = this.registerForm.value;
    if (data.password != data.confirmPassword)
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Confirm Password Does not match.',
      });

    if (this.files && this.files.length) {
      const file = this.files[0];
      const formData = new FormData(); // Create FormData object for file upload

      // Append necessary data to FormData
      formData.append('files', file);
      formData.append('bucketName', 'ProfileImage');
      this.fileUploadService.uploadFile(formData).subscribe((res) => {
        this.registerForm.patchValue({
          profilePic: this.fileUploadService.getFileUrl(
            res.urls[0],
            'ProfileImage'
          ),
        });
      });
      this.updateInformation();
    } else {
      this.updateInformation();
    }
  }

  updateInformation() {
    this.authenticationApiService
      .register(this.registerForm.value)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success!',
            detail: `Authorized! ${res.result}`,
          });
          this.router.navigate(['/auth/login']);
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Sorry!',
            detail: res.message,
          });
        }
      });
  }

  files = [];
  choose(event: any, callback: any) {
    callback();
  }
  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    console.warn(this.files);
  }
}
