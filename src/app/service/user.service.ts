import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }
  //formData can be read by requestparam 
  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetpassword/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`,
      formData,
      { reportProgress: true, observe: 'events' }//this is gonna track the upload of the image
    );
  }
  //any because we re not returning anything
  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  // add users to the local storage:
  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));//this should be done better?
  }

  public getUsersFromLocalCache(): User[] | null {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users')|| '{}');
    }
    return null;
  }

  public createUserFormData(loggedInUsername: string | null, user:User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername!);
    formData.append('firstName', user.firstName!);
    formData.append('lastName', user.lastName!);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', user.profileImageUrl);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }
  
}