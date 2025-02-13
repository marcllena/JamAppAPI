import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {HttpClientModule} from '@angular/common/http';
import { User } from "../models/user";
import { Environment } from "./environment";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  environment: Environment;
  selectedUser: User;
  users: User[];

  constructor(private http: HttpClient) {
    this.selectedUser = new User();
    this.environment = new Environment();
  }


  getUsers() {
    return this.http.get(this.environment.urlUser);
  }

  postUser(user: User) {
    return this.http.post(this.environment.urlUser, user)
  }

  /*getUser(_id: string) {
    return this.http.get(this.environment.urlProduct + `/${_id}`);
  }*/
}
