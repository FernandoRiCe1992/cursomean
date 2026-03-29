import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Album } from "../models/album";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { AlbumService } from "../services/album.service";
import { Artist } from "../models/artist";

@Component({
  selector: 'album-add',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/album-add.html',
  providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
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
    private _changeDetectorRef: ChangeDetectorRef

  ){
    this.titulo = 'Crear nuevo album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '','',2026,'', new Artist('','','',''));
    this.is_edit = false;
    this.filesToUpload = [];
  }

  ngOnInit() {
    console.log('album-add.component.ts cargado');

  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let artist_id = params['artist'];
      this.album.artist = artist_id

      this._albumService.addAlbum(this.token, this.album).subscribe({
        next: (res) => {
          if(!res.album){
            this.alertMessage = alert('Error en el servidor');
          }else{
            this.album = res.album;
            this.alertMessage = alert('El album se ha creado correctamente');
            this._router.navigate(['/editar-album', res.album._id]);
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

      console.log(this.album);
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }
}
