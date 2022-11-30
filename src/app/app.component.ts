import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationService } from './authentication/authentication.service';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  faCoffee = faCoffee;

  TOKEN:string=environment.LOCALSTORAGE_TOKEN_NAME;
  title = 'CleanWorkflowUI';
  constructor( private accountService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }
  loadCurrentUser() {
    const token = localStorage.getItem(this.TOKEN);
    this.accountService.loadCurrentUser(token).subscribe(() => {
      console.log('loaded user');
    }, error => {
      console.log(error);
    })
  }
}
