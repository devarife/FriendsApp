import { Component,OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit{
  users:User[]=[];

  constructor(private adminService:AdminService)
  {
  }

  ngOnInit(): void {
   this.getUsersWithRole();
  }

  getUsersWithRole(){
    this.adminService.getUsersWithRole().subscribe({
      next:users=>this.users=users
    })
  }


}
