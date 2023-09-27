import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/Account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService=inject(AccountService);
  const toastr=inject(ToastrService);
  const router=inject(Router);

  return accountService.currentUser$.pipe(
    map(user=>{
      if(user) return true;
      else{
        toastr.error("You can't navigate to this url");
        router.navigateByUrl('');
        return false;
      }
    })
  )
};
