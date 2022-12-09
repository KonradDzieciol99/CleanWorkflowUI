import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home/home.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private homeService:HomeService,private theme: ThemeService) { }

  ngOnInit(): void {
    
  }
  test(){
    this.homeService.testGet().subscribe(x=>{
      console.log(x);
    })
  }
  public switchTheme(): void {
    if (this.theme.current === 'light') {
        this.theme.current = 'dark';
    } else {
        this.theme.current = 'light';
    }
  }

}
