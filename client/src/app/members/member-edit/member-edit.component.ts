import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { User } from 'src/app/_models/User';
import { member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/Account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editform: NgForm | undefined;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editform?.dirty){
      $event.returnValue=true;
    }
  }
  member: member | undefined;
  user: User | null = null;

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: getUser => this.user = getUser
    })
  }
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: getMember => this.member = getMember
    })
  }

  updateMember() {
    this.memberService.updateMember(this.editform?.value).subscribe({
      next:_=>{
        this.toastr.success('Profile updated successfully!');
        this.editform?.reset(this.member);
      }
    })

  }
}
