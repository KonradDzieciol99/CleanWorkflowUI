import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home/home.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private homeService:HomeService) { }

  ngOnInit(): void {
  }
  test(){
    this.homeService.testGet().subscribe(x=>{
      console.log(x);
    })
  }


}
