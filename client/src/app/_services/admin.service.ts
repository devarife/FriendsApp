import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl=environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  getUsersWithRole(){
    return this.http.get<User[]>(this.baseUrl+'admin/users-with-roles');
  }
}
