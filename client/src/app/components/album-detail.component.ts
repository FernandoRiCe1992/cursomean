import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Album } from "../models/album";
import { Artist } from "../models/artist";
import { Song } from "../models/song";
import { UserService } from "../services/user.service";
import { AlbumService } from "../services/album.service";
import { SongService } from "../services/song.service";

@Component({
  selector: 'album-detail',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
  public album: Album;
  public songs: Song[];
  public identity: any;
  public token: string;
  public url: string;
  public alertMessage:any;
  public is_edit:boolean;
  public next_page: number;
  public prev_page: number;
  public confirmado: string | null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService,
    private _changeDetectorRef: ChangeDetectorRef
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.is_edit = true;
    this.album = new Album('','','',2026,'',new Artist('','','',''));
    this.next_page = 1;
    this.prev_page = 1;
    this.confirmado = null;
    this.songs = [];
  }

  ngOnInit() {
    console.log('album-detail.component.ts cargado');

    // Llamar al metodo del API para sacar un album de la base de datos
    this.getAlbum();

  }

  getAlbum(){
    console.log("el metodo funciona");
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      let page = params['page'];

      if(!page){
        page = 1;
      }else{
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if(this.prev_page == 0){
          this.prev_page = 1;
        }
      }

      this._albumService.getAlbum(this.token, id).subscribe({
        next: (res) => {
          if(!res.album){
            this._router.navigate(['/']);
          }else{
            this.album = res.album;
            this._changeDetectorRef.detectChanges();
            // Sacar las canciones del album
            this._songService.getSongs(this.token, res.album._id).subscribe({
              next: (res) => {

                if(!res.songs){
                  this.alertMessage = 'Este album no tiene canciones'
                }else{
                  this.songs = res.songs;
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

  onDeleteConfirm(id:string){
    this.confirmado = id;
  }

  onCancelSong(){
    this.confirmado = null
  }

  onDeleteSong(id:string){
    this._songService.deleteSong(this.token, id).subscribe({
      next: (res) => {
          if(!res.song){
            alert("Error en el servidor");
          }else{
            this.getAlbum();
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
  }

}

