import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { AccountService } from '../_services/Account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  user: any = {};
  registrationForm:FormGroup = new FormGroup({});
  maxDate:Date=new Date();
  validationErrors:string[]|undefined;

  constructor(private accountService: AccountService, private toastr:ToastrService, 
    private fb:FormBuilder, private router:Router) {

  }
  ngOnInit(): void {
    this.initilizeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initilizeForm(){
    this.registrationForm= this.fb.group({
      gender:['male',[Validators.required]],
      username:['',[Validators.required]],
      knownAs:['',[Validators.required]],
      dateOfBirth:['',[Validators.required]],
      city:['',[Validators.required]],
      country:['',[Validators.required]],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required,this.matchValues('password')]]
    });
    //this is to check if password feild is checked and revalidate the confirm password feild.
    this.registrationForm.controls['password'].valueChanges.subscribe({
      next:()=>{
        this.registrationForm.controls['confirmPassword'].updateValueAndValidity()
      }
    });
  }

  matchValues(matchTo:string):ValidatorFn{
    return(control:AbstractControl)=>{
      return control.value===control.parent?.get(matchTo)?.value ? null : {notMatching:true}
    }
  }

  register() {
    const dob=this.getDateOnly(this.registrationForm.controls['dateOfBirth'].value);
    const value={...this.registrationForm.value,dateOfBirth:dob}
    this.accountService.register(value).subscribe({
      next: response => {
        this.toastr.success('Registration complete !'),
        this.router.navigateByUrl('/members')
      },
      error: error=>{
        this.validationErrors=error
      }
    }
    )

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob:string|undefined){
    if(!dob) return;
    let theDob=new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString().slice(0,10)
  }
}
