import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { User } from 'src/app/_models/User';
import { member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/Account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
  //members$: Observable<member[]> | undefined;
  members:member[]=[];
  pagination:Pagination|undefined;
  userParams:UserParams|undefined;
  user:User | undefined;
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]


  constructor(private memberservice: MembersService, private accountService:AccountService) {
      this.userParams=memberservice.getUserParams();
   }


  ngOnInit(): void {
    // this.members$=this.memberservice.getMembers();
    this.loadMembers();
  }

  //implemented logic to subcribe to observable directly
  // loadMembers(){
  //   this.memberservice.getMembers().subscribe({
  //     next:members=>this.members=members
  //   })
  // }

  loadMembers()
  {
    if(this.userParams){
      this.memberservice.getMembers(this.userParams).subscribe({
        next:response=>{
          if(response.result && response.pagination){
              this.members=response.result;
              this.pagination=response.pagination;
          }
        }
      })
    }
  }

  resetFilters(){

      this.userParams=this.memberservice.resetUserParams();
      this.loadMembers();
    
  }
  pageChanged(event:any){

    if(this.userParams && this.userParams?.pageNumber!=event.page){
      this.userParams.pageNumber=event.page;
      this.memberservice.setUserParams(this.userParams);
      this.loadMembers();
    }

  }

}
