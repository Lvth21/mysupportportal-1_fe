import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { isEmpty, Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from "@auth0/angular-jwt";//injected directly

@Injectable({
  providedIn: 'root' //this is alternative to app.modul provided:
})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string | null;
  private loggedInUsername: string | null;
  private jwtHelper = new JwtHelperService();//initialized

  //in this way you can inject
  constructor(private http: HttpClient) { }

  //observable is a network call (because is waiting for the result)
  public login(user: User): Observable<HttpResponse<User>> {              //body //it means: when you get the response back, give to me the whole response, including the headers
    return this.http.post<User>(`${this.host}/user/login`, user, { observe: 'response' });//by default it would just be the request body
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }


  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User | null): void {
    if(user !=null)
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  public loadToken(): void | null {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string | null {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if ((this.token != null && this.token !== '') &&
      (this.jwtHelper.decodeToken(this.token).sub != null || '') &&
      (!this.jwtHelper.isTokenExpired(this.token))) {
      this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
      return true;
    }else{
      this.logOut();
      return false;
    }
  }

}
