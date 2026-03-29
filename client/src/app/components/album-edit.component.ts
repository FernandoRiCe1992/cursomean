import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Album } from "../models/album";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";
import { AlbumService } from "../services/album.service";
import { UploadService } from "../services/upload.service";

@Component({
  selector: 'album-edit',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/album-add.html',
  providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
  public titulo: string;
  public album: Album;
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
    private _albumService: AlbumService,
    private _uploadService: UploadService,
    private _changeDetectorRef: ChangeDetectorRef

  ){
    this.titulo = 'Editar album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '','',2026,'', new Artist('','','',''));
    this.is_edit = true;
    this.filesToUpload = [];
  }

  ngOnInit() {
    console.log('album-edit.component.ts cargado');

    // Conseguir el album
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe({
        next: (res) => {
          if(!res.album){
            this._router.navigate(['/']);
          }else{
            this.album = res.album;
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
      })
    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];


      this._albumService.editAlbum(this.token, id, this.album).subscribe({
        next: (res) => {
          if(!res.album){
            this.alertMessage = alert('Error en el servidor');
          }else{
            this.album = res.album;
            this.alertMessage = alert('El album se ha actualizado correctamente');

            // subir la imagen del album
            if(this.filesToUpload.length === 0){
              this._router.navigate(['/artista', this.album.artist]);
              // this._changeDetectorRef.detectChanges();
            }else{
              this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id, [], this.filesToUpload, this.token, 'image')
                .then((res) =>{
                  this._router.navigate(['/artista', this.album.artist]);
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
          }
        }
      });

    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }
}
