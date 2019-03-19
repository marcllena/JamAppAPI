import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { User } from "../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../../res/fonts/util.css','../../res/vendor/bootstrap/css/bootstrap.min.css','../../res/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    '../../res/fonts/iconic/css/material-design-iconic-font.min.css','../../res/vendor/animate/animate.css','../../res/vendor/css-hamburgers/hamburgers.min.css', '../../res/vendor/animsition/css/animsition.min.css',
    '../../res/vendor/select2/select2.min.css','../../res/vendor/daterangepicker/daterangepicker.css'
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  validation_messages: any;

  constructor(private userService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)])),

        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*\d).{4,}$/)])),
      }
    )
  }

  ngOnInit() {
    let token =localStorage.getItem('token');
    if(token!=null) {
      this.comprobarLogin(token);
    }
    this.validation_messages = {
      'email': [
        { type: 'required', message: 'Mail: Requerido' },
        { type: 'error', message: 'Error: Correo o contraseña incorrecta'} ,
        { type: 'pattern', message: 'Mail: Debe ser una dirección de correo válida' }
      ],
      'password': [
        { type: 'required', message: 'Contraseña: Requerida' },
        { type: 'pattern', message: 'Contraseña: Debe contener más de 4, incluyendo un número como mínimo' },
        { type: 'error', message: 'Error: Correo o contraseña incorrecta'} ,
      ],
    }
  }


  login() {
    console.log("Operació de login realitzada al BackEnd:"+this.loginForm.value);
    let user = new User(this.loginForm.value.email,"", this.loginForm.value.password);
    this.userService.signin(user)
      .subscribe(response => {
          console.log("Resposta del BackEnd"+response);
          if(response.status==200){
            //Operació Realitzada Correctament
            let token = response.body['token'];
            localStorage.setItem('token', token);
            localStorage.setItem('_id',response.body['_id']);
            this.router.navigateByUrl("/api/settings");
          }
          else {
            //Error desconegut
            console.log("Error");
            this.loginForm.get("username").setErrors({
              error: true,
            });
          }
        },
        err => {
          console.log("Error del BackEnd"+err);
          //console.log(err);
          if(err.status==404) {
            console.log("404");
            this.loginForm.get("password").setErrors({
              error: true
            });
          }
          else if(err.status==500) {
            console.log("500");
            this.loginForm.get("password").setErrors({
              error: true,
            });
          }
        });
  }

  comprobarLogin(token) {
      console.log("Operació de comprobació de login realitzada al BackEnd:" + this.loginForm.value);
      this.userService.checksignin(token)
        .subscribe(response => {
            console.log("Resposta del BackEnd" + response);
            if (response.status == 200) {
              //El usuari ja te login
              this.router.navigateByUrl("/api/settings");
            } else {
              //Error desconegut
              console.log("Error");
              this.loginForm.get("username").setErrors({
                error: true,
              });
            }
          },
          err => {
            console.log("Error del BackEnd" + err);
            //console.log(err);
            if (err.status == 404) {
              console.log("404");
              this.loginForm.get("password").setErrors({
                error: true
              });
            } else if (err.status == 500) {
              console.log("500");
              this.loginForm.get("password").setErrors({
                error: true,
              });
            }
          });
  }

}
