import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { User } from "../../models/user";
import {passValidator} from "./validator";
import { DataService } from 'src/app/services/data.services';
import {AlertController} from "@ionic/angular";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css','../../res/fonts/util.css','../../res/vendor/bootstrap/css/bootstrap.min.css','../../res/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    '../../res/fonts/iconic/css/material-design-iconic-font.min.css','../../res/vendor/animate/animate.css','../../res/vendor/css-hamburgers/hamburgers.min.css', '../../res/vendor/animsition/css/animsition.min.css',
    '../../res/vendor/select2/select2.min.css','../../res/vendor/daterangepicker/daterangepicker.css'
  ]
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  validation_messages: any;
  politicaChecked:boolean;
  facebookId: any;
  constructor(private userService: AuthService, private singleton: DataService,
              private router: Router, private formBuilder: FormBuilder,private alertController: AlertController) {
    this.politicaChecked=false;
    let name;
    this.singleton.newUsername.subscribe(nam => name = nam)
    console.log(name)
    
    this.singleton.newFacebookId.subscribe(facebookI => this.facebookId = facebookI)
    this.registerForm = this.formBuilder.group({
      
        username: new FormControl(name, Validators.compose([
          Validators.required,
          Validators.pattern(/.{0,15}$/)])),

        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)])),

        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*\d).{4,8}$/)])),

        confirmPassword: ['', passValidator],

        profile:new FormControl('', Validators.compose([
          Validators.required])),

        adminPassword:''
      }
    )
  }

  ngOnInit() {
      document.body.classList.add('bg-img');
    this.validation_messages = {
      'username': [
        { type: 'required', message: 'Nombre de Usuario: Requerido'},
        { type: 'pattern', message: 'Nombre de Usuario: Debe contener 15 carácteres como máximo' },
      ],
      'email': [
        { type: 'required', message: 'Mail: Requerido' },
        { type: 'error', message: 'Error: Ya existe una cuenta de usuario con este mail'} ,
        { type: 'pattern', message: 'Mail: Debe ser una dirección de correo válida' }
      ],
      'password': [
        { type: 'required', message: 'Contraseña: Requerida' },
        { type: 'pattern', message: 'Contraseña: Debe contener entre 4 y 8 carácteres, incluyendo un número como mínimo' },
        { type: 'error', message: 'Contraseña: Ambas contraseñas deben coincidir'}
      ],
      'confirmPassword': [
        { type: 'required', message: 'Confirmar Contraseña: Requerida' },
        { type: 'pattern', message: 'Contraseña: Debe contener entre 4 y 8 carácteres, incluyendo un número como mínimo' },
      ],
      'profile': [
        { type: 'required', message: 'Perfil de usuario: Requerido' }
      ]
    }
    }

  //Perque surti la posibilitat d'admin
  adminCandidate = false;
  userReps = 0; //numero de cops que li dona a user a la combinacio correcta de botons
  
  //Augmentem el userReps
  incUserReps() {
    if(this.registerForm.value.profile == "room" && this.userReps == 0){
      this.userReps ++;
    } 
    else if (this.registerForm.value.profile == "music" && this.userReps == 1){
      this.userReps ++;
    }
    else if (this.registerForm.value.profile == "room" && this.userReps == 2){
      this.userReps ++;
    } 
    else if (this.registerForm.value.profile == "music" && this.userReps == 3){
      this.userReps ++;
    } 
    else {
      this.userReps = 0;
    }

    if(this.userReps > 3){
      this.adminCandidate = true;
    }
  }

  checkPolitica(){
    if(this.politicaChecked){
      this.politicaChecked=false;
    }
    else {
      this.politicaChecked = true;
    }
  }

  async registrarse() {
    if (!this.politicaChecked) {
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Debe aceptar nuestra política de privacidad',
        buttons: [
          {
            text: 'OK',
            handler: () => {
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log("Operació de registre realitzada al BackEnd:" + this.registerForm.value);
      let user = new User(this.registerForm.value.email, this.registerForm.value.username, this.registerForm.value.password);
      user.facebookId = this.facebookId
      localStorage.setItem('username', this.facebookId);
      switch (this.registerForm.value.profile) {
        case "user":
          user.userType = 0;
          break;
        case "music":
          user.userType = 1;
          break;
        case "room":
          user.userType = 2;
          break;
        case "admin":
          user.userType = 3;
          user.pass = this.registerForm.value.adminPassword;
          break;
      }

      this.userService.signup(user)
        .subscribe(response => {
            console.log("Resposta del BackEnd" + JSON.stringify(response));
            if (response.status == 200) {
              //Operació Realitzada Correctament
              let token = response.body['token'];
              localStorage.setItem('token', token);
              localStorage.setItem('id', response.body['_id']);
              localStorage.setItem('userType', response.body['userType']);
              localStorage.setItem('username', response.body['username']);
              if(localStorage.getItem('facebookId')!= user.facebookId){
                 localStorage.setItem('facebookId', 'pending');
              }
              this.singleton.changeFacebookId(true)
              //Li passem la ubicació al registrarse:
              this.router.navigateByUrl("api/pickLocation");
            } else {
              //Error desconegut
              console.log("Error");
              this.registerForm.get("username").setErrors({
                error: true,
              });
            }
          },
          err => {
            console.log("Error del BackEnd" + err);
            if (err.status == 409) {
              console.log("409");
              this.registerForm.get("email").setErrors({
                error: true
              });
            } else if (err.status == 500) {
              console.log("500");
              this.registerForm.get("password").setErrors({
                error: true,
              });
            }
          });
    }
  }

}
