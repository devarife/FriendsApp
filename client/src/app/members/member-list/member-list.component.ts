import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
  members$: Observable<member[]> | undefined;

  constructor(private memberservice: MembersService) { }


  ngOnInit(): void {
    this.members$=this.memberservice.getMembers();
  }

  //implemented logic to subcribe to observable directly
  // loadMembers(){
  //   this.memberservice.getMembers().subscribe({
  //     next:members=>this.members=members
  //   })
  // }

}
