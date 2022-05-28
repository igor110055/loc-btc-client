import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { LoginService } from 'src/app/services/login.service';
import { ToastrsService } from 'src/app/services/toastrs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordType = 'password';
  public inputForm: FormGroup;
  constructor(
    private _gservice: GeneralService,
    private _service: LoginService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private _notify:ToastrsService) { 
    this.inputForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  } 
  private loginData: any;

  ngOnInit(): void {
    var token = this._gservice.getToken();
    if(!!token)
    this._router.navigateByUrl("/public/dashboard");    
  }

  onSubmit(){   
    if(this.inputForm.value.email && this.inputForm.value.password){
      this._service.getLoginData({"emailAddress":this.inputForm.value.email, "password":this.inputForm.value.password}).subscribe((res: any) => {
        if(res && res.statusCode === 200) {
          this._gservice.setToken(res.data.token);
          this._notify.success("Welcome", "Login successful");
          this._router.navigateByUrl("/public/dashboard");    
        } else {
          this._notify.error("Login Failed", "Check username passwrod")
        }
      },(error: any) => {
        this._notify.error("Login Failed", "Something went wrong")
      })
    }  
  }

}
