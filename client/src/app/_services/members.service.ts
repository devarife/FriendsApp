import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { member } from 'src/app/_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './Account.service';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: member[] = [];
  paginatedResult: PaginatedResult<member[]> = new PaginatedResult<member[]>;
  memberCache = new Map();
  user:User|undefined;
  userParams:UserParams|undefined;

  constructor(private http: HttpClient, private accountService:AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user=>{
        if(user)
        {
          this.userParams=new UserParams(user);
          this.user=user;
        }
      }
    })
  }

  getUserParams(){
    return this.userParams
  }

  setUserParams(params:UserParams){
    this.userParams=params
  }
  
  resetUserParams(){
    if(this.user){
      this.userParams=new UserParams(this.user);
      return this.userParams
    }
    return;
  }

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    console.log(response);

    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResults<member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    )

  }

  getMember(username: string) {
    //old implementation where storing member infor in member[]
    // const member = this.members.find(x => x.userName === username)
    // if (member) return of(member);

    const member=[...this.memberCache.values()]
    .reduce((arr, elem)=>arr.concat(elem.result),[])
    .find((member:member)=>member.userName==username)

    if(member) return of(member);

    return this.http.get<member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username:string){
    return this.http.post(this.baseUrl+'likes/'+username,{});
  }

  getLikes(predicate:string,pagedNumber:number,pageSize:number){
    let params=this.getPaginationHeaders(pagedNumber,pageSize);
    params=params.append('predicate',predicate);

    return this.getPaginatedResults<member[]>(this.baseUrl+'likes',params);

    //return this.http.get<member[]>(this.baseUrl+'likes?predicate='+predicate);
  }

  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(page: number | undefined, itemsPerPage: number | undefined) {
    let params = new HttpParams();
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return params;
  }





  ///////////
  //samilar logic implemented in interceptors
  // getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }


  //forGetMembers
  //commented for new logic to use pagination below
  // //newlogic to use data stored in serivces before detroyed.
  // if (this.members.length > 0) return of(this.members);
  // //existing logic
  // return this.http.get<member[]>(this.baseUrl + 'users').pipe(
  //   map(members => {
  //     this.members = members;
  //     return members;
  //   })
  // )
}
