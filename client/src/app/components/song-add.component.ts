import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Song } from "../models/song";
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";


@Component({
  selector: 'song-add',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
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
    private _changeDetectorRef: ChangeDetectorRef

  ){
    this.titulo = 'Crear nueva canción';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('',1,'','','','')
    this.is_edit = false;
    this.filesToUpload = [];
  }

  ngOnInit() {
    console.log('song-add.component.ts cargado');

  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let album_id = params['album'];
      this.song.album = album_id

      console.log(this.song);

      this._songService.addSong(this.token, this.song).subscribe({
        next: (res) => {
          if(!res.song){
            this.alertMessage = alert('Error en el servidor');
          }else{
            this.song = res.song;
            this.alertMessage = alert('La canción se ha creado correctamente');
            this._router.navigate(['/editar-tema', res.song._id]);
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
