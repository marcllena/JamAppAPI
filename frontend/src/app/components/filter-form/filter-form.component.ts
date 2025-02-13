import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss','../../res/fonts/util.css','../../res/vendor/bootstrap/css/bootstrap.min.css','../../res/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    '../../res/fonts/iconic/css/material-design-iconic-font.min.css','../../res/vendor/animate/animate.css','../../res/vendor/css-hamburgers/hamburgers.min.css', '../../res/vendor/animsition/css/animsition.min.css',
    '../../res/vendor/select2/select2.min.css','../../res/vendor/daterangepicker/daterangepicker.css']
})
export class FilterFormComponent implements OnInit {

  musics: boolean;
  salas:boolean;
  distanciaBoolean:boolean;
  distanciaValue:number;

  constructor(private singleton: DataService,  private router: Router) { }

  ngOnInit() {
    this.musics=true;
    this.salas=true;
    this.distanciaBoolean=false;
  }

  checkMusics(){
    if(this.musics){
      this.musics=false;
    }
    else {
      this.musics = true;
    }
  }
  checkSalas(){
    if(this.salas){
      this.salas=false;
    }
    else{
      this.salas=true;
    }
  }

  checkDistance(){
    if(this.distanciaBoolean){
      this.distanciaBoolean=false;
    }
    else{
      this.distanciaBoolean=true;
    }
  }

  rangeChange(event)
  {
    this.distanciaValue = event.detail.value;
  }

  exportFilters(){
    this.singleton.changeMusicsFilter(this.musics);
    this.singleton.changeSalesFilter(this.salas);
    this.singleton.changeDistanciaBooleanFilter(this.distanciaBoolean);
    this.singleton.changeDistanciaValueFilter(this.distanciaValue);
    this.router.navigateByUrl("api/menu/home");
  }

}
