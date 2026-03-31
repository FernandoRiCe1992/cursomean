import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Song } from "../models/song";
import { Album } from "../models/album";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";
import { UploadService } from "../services/upload.service";


@Component({
  selector: 'song-edit',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
  public titulo: string;
  public identity: any;
  public token: string;
  public song: Song;
  public url: string;
  public alertMessage:any;
  public is_edit:boolean;
  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
    private _uploadService: UploadService,
    private _changeDetectorRef: ChangeDetectorRef

  ){
    this.titulo = 'Editar canción';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('',1,'','','',new Album('','','',1,'',new Artist('','','','')));
    this.is_edit = true;
    this.filesToUpload = [];
  }

  ngOnInit() {
    console.log('song-edit.component.ts cargado');

    // sacar la cancion a editar
    this.getSong();
  }

  getSong(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._songService.getSong(this.token, id).subscribe({
        next: (res) => {
          if(!res.song){
            this._router.navigate(['/']);
          }else{
            this.song = res.song;
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

      console.log(this.song);

      this._songService.editSong(this.token, id, this.song).subscribe({
        next: (res) => {
          if(!res.song){
            this.alertMessage = alert('Error en el servidor');
          }else{
            this.alertMessage = alert('La canción se ha actualizado correctamente');
            // this._router.navigate(['/editar-album', res.album._id]);

            // subir la imagen del album
            if(this.filesToUpload.length === 0){
              this._router.navigate(['/album', res.song.album]);
              // this._changeDetectorRef.detectChanges();
            }else{
              this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, [], this.filesToUpload, this.token, 'file')
                .then((res) =>{
                  this._router.navigate(['/album', this.song.album]);
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
