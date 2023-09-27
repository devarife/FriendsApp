import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/Account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Friends App';
  users: any;

  constructor(private accountservice: AccountService) {

  }
  ngOnInit(): void {
    this.setCurrentUser();
  }


  setCurrentUser() {
    const userjson = localStorage.getItem('user');
    if (!userjson) return;
    const user = JSON.parse(userjson);
    this.accountservice.setCurrentUser(user);
  }


}
