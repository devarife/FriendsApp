import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {

  @Input() membercard :member|undefined;

  
  constructor(private memberService:MembersService,private toastr:ToastrService) {
    
  }

  addLike(member:member){
      this.memberService.addLike(member.userName).subscribe({
        next:()=>this.toastr.success('Like sent to' + member.knownAs)
      });
  }
  
}
