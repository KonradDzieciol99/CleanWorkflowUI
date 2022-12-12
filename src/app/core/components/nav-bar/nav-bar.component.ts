import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { HomeService } from 'src/app/home/home.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private homeService:HomeService
      ,private themeService: ThemeService
      ,private authenticationService:AuthenticationService) {

   }
  isCollapsed = true;
  ngOnInit(): void {
    
  }
  test(){
    this.homeService.testGet().subscribe(x=>{
      console.log(x);
    })
  }
  public switchTheme(): void {
    if (this.themeService.current === 'light') {
        this.themeService.setCurrent('dark');
    } else {
      this.themeService.setCurrent('light');
    }
  }
  public destory(){
    this.themeService.testdestroy();
  }
  logout(){
    this.authenticationService.logout();
  }
}
