import { Component, OnInit } from "@angular/core";
import { RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from "../services/user.service";
import { User } from "../models/user";

@Component({
  selector: 'user-edit',
  imports: [RouterOutlet, FormsModule, RouterModule],
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})

export class UserEditComponent implements OnInit{
  public titulo: string;
  public user: User;
  public identity:any;
  public token:any;
  public alertMessage:any;

constructor(
  private _userService: UserService
){
  this.titulo = 'Actualizar usuario';
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();
  this.user = this.identity;
}

  ngOnInit(): void {
    console.log('user-edit.component.ts cargado')
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe({
      next: (res) => {  
        if(!res.user){
          this.alertMessage = 'El usuario no se ha actualizado';
        }else{
          //this.user = res.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          let identity_name = document.getElementById("identity_name")

          if(identity_name !== null && identity_name !== undefined){
            identity_name.innerHTML = this.user.name;
          }
          this.alertMessage = 'Datos actualizados correctamente';
        }
      },
      error: (err) => {
        let alertMessage = <any>err;

        if (alertMessage != null){
          let body = err?.error?.message;
          this.alertMessage = body;
        }
      }
    });
  }
};