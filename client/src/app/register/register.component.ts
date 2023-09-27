import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../_services/Account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private accountService: AccountService) {

  }
  @Output() cancelRegister = new EventEmitter();

  user: any = {};

  register() {
    this.accountService.register(this.user).subscribe({
      next: response => {
        console.log(response);
      },
      error:error => {
        console.log(error);
      }
    }
    )
    this.cancel();
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
