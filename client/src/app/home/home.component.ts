import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  users: any;
  registerMode: boolean = false;

  constructor() {
  }


  ngOnInit(): void {

  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }


  cancelRegistrationMode(event:boolean){
    this.registerMode=event;
  }

}
