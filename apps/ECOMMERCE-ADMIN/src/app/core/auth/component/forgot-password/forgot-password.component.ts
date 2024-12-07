import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {OtpValidationApiService} from "flusysng/core/services";
import {take} from "rxjs";
import {MessageService} from "primeng/api";
import { AngularModule, PrimeModule } from 'libs/shared/src';
import { AuthenticationApiService } from '../../service/authentication-api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers:[
    OtpValidationApiService
  ]
})
export class ForgotPasswordComponent {
  isOptSend=false;
  changePassObj={
    otpCode:'',
    password:'',
    confirmPassword:'',
    email:'',
    clientRequestId:''
  }

  constructor(private otpValidationApiService:OtpValidationApiService,
              private authenticationApiService:AuthenticationApiService,
              private messageService: MessageService,
              private router:Router) {
  }

  send(){
    if(this.changePassObj.email){
      this.changePassObj={...this.changePassObj,...{clientRequestId:this.clientRequestIdForCode}}
      const data={
        clientRequestId: this.changePassObj.clientRequestId,
        value:this.changePassObj.email,
      };
      this.otpValidationApiService.sendCode(data).pipe(take(1)).subscribe(res=>{
        this.isOptSend=res.success;
      })
    }
  }
  get clientRequestIdForCode() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return (
      s4() + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + '-' + s4() +
      s4() + s4()
    );
  }

  verifyAndChangePassword(){
    this.authenticationApiService.verifyAndChangePassword(this.changePassObj).pipe(take(1)).subscribe(res=>{
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.result });
        this.router.navigate(['/auth/login']);
      } else {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Sorry!', detail: res.message });
      }
    })
  }

}
