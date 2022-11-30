import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { IRegisterUser } from 'src/app/shared/models/IRegisterUser';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  faLinkedin = faLinkedin
  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('',[Validators.required, Validators.email,Validators.minLength(6)]),
    password: new FormControl<string>('',[Validators.required,Validators.minLength(6)]),
  });

  constructor(private authenticationService:AuthenticationService,private toastrService: ToastrService) { }

  ngOnInit(): void {
  }
  onSubmit(form: FormGroup) {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return;
    }
    let registerUser:IRegisterUser={
      email: this.loginForm.get("email")?.value,
      password: this.loginForm.get("password")?.value
    }

    this.authenticationService.register(registerUser).subscribe(() => {
        this.toastrService.success("Rejestracja przebiegła pomyslnie");
    });
  }

}
