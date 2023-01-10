import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
//we are going to intercept the requests and modify them
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if(httpRequest.url.includes(`${this.authenticationService.host}/user/login`)){
      return httpHandler.handle(httpRequest);
    }
    if(httpRequest.url.includes(`${this.authenticationService.host}/user/register`)){
      return httpHandler.handle(httpRequest);
    }
   
    this.authenticationService.loadToken();
    const token  = this.authenticationService.getToken();
    const request = httpRequest.clone({setHeaders: { Authorization: `Bearer ${token}` }})
//I pass the clone instead of the original request, with the header with the token 
    return httpHandler.handle(request);
  }
}
