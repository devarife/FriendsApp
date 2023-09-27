import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../_services/Account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private accountService: AccountService, private toastr: ToastrService) {

  }
  @Output() cancelRegister = new EventEmitter();

  user: any = {};

  register() {
    this.accountService.register(this.user).subscribe({
      next: response => {
        this.toastr.success('Registration complete !'),
          this.cancel();
      },
      error: error => {
        const errorarr: string[] = [error.error.errors.Username, error.error.errors.Password]
        errorarr.forEach((_element: any) => {
          this.toastr.error(_element);
        });

      }
    }
    )

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
