import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IUser } from '../../interfaces/user-data.interface';
import { UserApiService } from '../../services/user-api.service';
import { UserFormService } from '../../services/user-form.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-user-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent {
  userFormService = inject(UserFormService);
  userStateService = inject(UserStateService);
  userApiService = inject(UserApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IUser | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.userStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.userFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.userFormService.formGroup.invalid) {
      this.userFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.userFormService.formGroup.value;
    if(!data.password) {
      delete data.password;
    }
    (this.model ? this.userApiService.update(data) : this.userApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.userFormService.patchValue({ id: res.result });
        this.userStateService.addOrUpdateDataList(this.userFormService.value);
        this.clearInputForm()
      } else {
        return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
      }
    }, (err) => {
      this.messageService.add({
        key: 'tst',
        severity: 'warn',
        summary: 'Sorry!',
        detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
      });
    })
  }


  clearInputForm() {
    this.userFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.userStateService.setState({ editModelData: null });
  }
}
