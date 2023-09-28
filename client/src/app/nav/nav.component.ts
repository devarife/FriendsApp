import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/Account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  model:any={};
  usernameGet:string='';

  constructor(public accountservice:AccountService,private router: Router, private toastr: ToastrService ) {
    
  }
  ngOnInit(): void {

  }


  login(){
    this.accountservice.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
      }
      
    })
  }

  logout(){
    this.accountservice.logout();
    this.router.navigateByUrl('/');
  }

}
