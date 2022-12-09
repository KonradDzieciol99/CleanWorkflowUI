import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly style: HTMLLinkElement;
  public static default = 'light';

  public get current(): string {
    return localStorage.getItem('theme') ?? ThemeService.default;
  }

  public set current(value: string) {
    //localStorage.setItem('theme', value);
    //this.style.href = `/themes/${value}.scss`;
    //this.style.href = `/themes/${value}.scss`;
    
    this.style.href = `light.css`;
  }

  

  constructor() {
    this.style = document.createElement('link');
     this.style.rel = 'stylesheet';
     document.head.appendChild(this.style);
//     this.style.href = "src/themes/dark.scss";//
// //src\themes\dark.scss
//     if (localStorage.getItem('theme') !== undefined) {
//         this.style.href = `/themes/${this.current}.scss`;
//     }
  }
}
