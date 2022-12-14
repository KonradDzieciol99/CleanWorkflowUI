import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationService } from './authentication/authentication.service';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  
  faCoffee = faCoffee;
  showHeader = false;
  showSidebar = false;
  showFooter = false;
  title = 'CleanWorkflowUI';
  constructor(private router: Router,private activatedRoute: ActivatedRoute,private authenticationService: AuthenticationService ) {

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild?.snapshot.data['showHeader']!== false ? this.showHeader=true:this.showHeader=false;
        this.showSidebar = this.activatedRoute.firstChild?.snapshot.data['showSidebar']!== false ? this.showSidebar=true:this.showSidebar=false;
        this.showFooter = this.activatedRoute.firstChild?.snapshot.data['showFooter']!== false ? this.showFooter=true:this.showFooter=false;
      }
    });
    this.tryloadCurrentUser();
  }
  tryloadCurrentUser() {
    this.authenticationService.refreshCurrentUser().pipe(take(1)).subscribe(()=>{
      this.router.navigateByUrl('.../home');
    });
  }
}


// console.log(window.matchMedia('(prefers-color-scheme: dark)'));
// console.log(window.matchMedia('(prefers-color-scheme: light)'));
// if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
//   console.log('🎉 Dark mode is supported');
// }
//this.loadCurrentUser();