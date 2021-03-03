import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated(): boolean {
    let userDetail = JSON.parse(localStorage.getItem('user'))
    return (userDetail && userDetail.createdOn +21600000 <= new Date().getTime() ||!localStorage.getItem('user'));
  }

  constructor() { }
}
