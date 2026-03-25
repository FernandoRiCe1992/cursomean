import { Component, OnInit } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";

@Component({
  selector: 'user-edit',
  imports: [FormsModule, RouterModule],
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})

export class UserEditComponent implements OnInit{
  public titulo: string;
  public user: User;
  public identity:any;
  public token:any;
  public alertMessage:any;
  public filesToUpload: Array<File>;
  public url:string;

constructor(
  private _userService: UserService
){
  this.titulo = 'Actualizar usuario';
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();
  this.user = this.identity;
  this.filesToUpload = [];
  this.url = GLOBAL.url;
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
          localStorage.setItem('identity', JSON.stringify(this.user));
          let identity_name = document.getElementById("identity_name")
          if(identity_name !== null && identity_name !== undefined){
            identity_name.innerHTML = this.user.name;
          }

          if(!this.filesToUpload){
            // redireccion
          }else{
            this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
              (result: any) =>{
                this.user.image = result.image; 
                localStorage.setItem('identity', JSON.stringify(this.user));
                let image_path = this.url+'get-image-user/'+this.user.image;


                let user_image = document.getElementById("user-image");
                if(user_image !== null && user_image !== undefined){
                  user_image.setAttribute('src', image_path)
                }
              }
            ).catch(e =>{console.log(e);});
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

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>){
    let token = this.token;

    return new Promise(function(resolve, reject){
      let formData:any = new FormData();
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);

      for(let i = 0; i < files.length; i++){
        formData.append('image', files[i], files[i].name);
      }


      xhr.send(formData);

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          };
        };
      };

    });
  }
};