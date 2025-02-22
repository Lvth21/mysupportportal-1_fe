import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
//guard is to redirect the user to certain roots
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService : AuthenticationService, 
              private router: Router,
              private notificationService: NotificationService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return true;
  }

  private isUserLoggedIn(): boolean{
    if(this.authenticationService.isUserLoggedIn()){
      return true;
    }
    this.router.navigate(['login']);
    this.notificationService.notify(NotificationType.ERROR, 'You need to log in to access this page')
    return false;
  }
  
}
