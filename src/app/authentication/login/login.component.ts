import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faLinkedin = faLinkedin
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email,Validators.minLength(6)]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
  });

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Name', form.value.name);
    console.log('Email', form.value.email);
    console.log('Message', form.value.message);
  }

}
