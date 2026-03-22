import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from './models/user';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
})
export class App {
  // protected readonly title = signal('client');
  public title = 'MUSICALLY';
  public user: User;
  public identity: boolean;
  public token: any;

  constructor(){
    this.user = new User('','','','','','ROLE_USER','');
    this.identity = false;
  }

  public onSubmit(){
    console.log(this.user);
  }
}
