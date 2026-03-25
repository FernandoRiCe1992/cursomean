import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GLOBAL } from './services/global';
import { User } from './models/user';
import { UserService } from './services/user.service';
// import { UserEditComponent } from './components/user-edit.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterModule],
  templateUrl: './app.html',
  providers:[UserService]
})
export class App implements OnInit{
  // protected readonly title = signal('client');
  public title = 'MUSICALLY';
  public user: User;
  public user_register: User;
  public identity: any;
  public token: any;
  public errorMessage: any;
  public alertRegister: any;
  public url: string;

  constructor(
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.identity = false;
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){

    // Conseguir los datos del usuario identificado
    this._userService.singup(this.user, null).subscribe({
      next: (res) => {
        let identity = res.user;
        this.identity = identity;

        if(!this.identity){
          alert("El usuario no esta logueado correctamente");
        }else{
          // conseguir el token para enviarselo a cada peticion

          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.singup(this.user, true).subscribe({
            next: (res) => {
              let token = res.token;
              this.token = token;

              if(this.token.length <= 0){
                alert("El token no se ha generado correctamente");
              }else{
                // Crear elemento en el localStorage para tener al usuario en sesion
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
              };
            },
            error: (err) => {
              let errorMessage = <any>err;

              if (errorMessage != null){
              let body = err?.error?.message;
              this.errorMessage = body;
              }
            }
          });
        };
      },
      error: (err) => {
        let errorMessage = <any>err;

        if (errorMessage != null){
          let body = err?.error?.message;
          this.errorMessage = body;
        }
      }
    });
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe({
      next: (res) => {
        let user = res.user;
        this.user_register = user;

        if(!user){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El Registro se ha realizado correctamente, identificate con: '+this.user_register.email
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error: (err) => {
        let errorMessage = <any>err;

        if (errorMessage != null){
          let body = err?.error?.message;
          this.alertRegister = body;
        }
      }
    });
  }
}


