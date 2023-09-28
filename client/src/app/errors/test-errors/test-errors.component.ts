import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
  validationErrors:string[]=[];
  baseUrl='http://localhost:5000/api/';
 
  constructor(private http:HttpClient) {

  }

  ngOnInit(): void {

  }

  get404Error(){
    this.http.get(this.baseUrl+'buggy/not-found').subscribe({
      next:x=>console.log(x),
      error:e=>console.log(e)
    });
  }

  get401Error(){
    this.http.get(this.baseUrl+'buggy/auth').subscribe({
      next:x=>console.log(x),
      error:e=>console.log(e)
    });
  }

  get400Error(){
    this.http.get(this.baseUrl+'buggy/bad-request').subscribe({
      next:x=>console.log(x),
      error:e=>console.log(e)
    });
  }

  get500Error(){
    this.http.get(this.baseUrl+'buggy/server-error').subscribe({
      next:x=>console.log(x),
      error:e=>console.log(e)
    });
  }

  get400ValidationError(){
    this.http.post(this.baseUrl+'account/register',{}).subscribe({
      next:x=>console.log(x),
      error:e=>{
        console.log(e);
        this.validationErrors=e;  
      }
    });
  }

}
