import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Artist } from '../models/artist';
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { UploadService } from "../services/upload.service";

@Component({
  selector: 'artist-edit',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
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
    private _artistService: ArtistService,
    private _uploadService: UploadService,
    private _changeDetectorRef: ChangeDetectorRef
  ){
    this.titulo = 'Editar artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','','');
    this.is_edit = true;
    this.filesToUpload = [];
  }

  ngOnInit() {
    console.log('artist-add.component.ts cargado');

    // Llamar al metodo del API para sacar un artista en base a su id getArtist
    this.getArtist();

  }

  getArtist(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

      this._artistService.getArtist(this.token, id).subscribe({
        next: (res) => {
          if(!res.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = res.artist;
            this._changeDetectorRef.detectChanges();
          }
        },
        error: (err) => {
          let alertMessage = <any>err;

          if (alertMessage != null){
            let body = err?.error?.message;
            this.alertMessage = body;
            this._changeDetectorRef.detectChanges();
          }
        }
      });
    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._artistService.editArtist(this.token, id, this.artist).subscribe({
        next: (res) => {

          if(!res.artist){
            this.alertMessage = alert('Error en el servidor');
          }else{
            this.alertMessage = alert('El artista se ha actualizado correctamente');

            // subir la imagen del artista
            if(this.filesToUpload.length === 0){
              this._router.navigate(['/editar-artista', res.artist._id]);
              this._changeDetectorRef.detectChanges();
            }else{
              this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
                .then((res) =>{
                  this._router.navigate(['/artista', id]);
                  this._changeDetectorRef.detectChanges();
                })
                .catch((err) => {
                  console.log(err);
                })
            }
          }
        },
        error: (err) => {
          let alertMessage = <any>err;

          if (alertMessage != null){
            let body = err?.error?.message;
            this.alertMessage = body;
            this._changeDetectorRef.detectChanges();

            console.log(body);
          }
        }
      })
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }

}

