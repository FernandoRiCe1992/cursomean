import { Component, OnInit } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";

@Component({
  selector: 'artist-add',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity: any;
  public token: string;
  public url: string;
  public alertMessage:any;
  public is_edit:boolean;
  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ){
    this.titulo = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','','');
    this.is_edit = false;
    this.filesToUpload = [];
  }

  ngOnInit() {
    console.log('artist-add.component.ts cargado');
  }

  onSubmit(){
    this._artistService.addArtist(this.token, this.artist).subscribe({
      next: (res) => {
        if(!res.artist){
          this.alertMessage = alert('Error en el servidor');
        }else{
          this.artist = res.artist;
          this.alertMessage = alert('El artista se ha creado correctamente');
          this._router.navigate(['/editar-artista', res.artist._id])
        }
      },
      error: (err) => {
        let alertMessage = <any>err;

        if (alertMessage != null){
          let body = err?.error?.message;
          this.alertMessage = body;

          console.log(body);
        }
      }
    })
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


}

