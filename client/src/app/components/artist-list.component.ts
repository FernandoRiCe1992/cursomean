import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { GLOBAL } from "../services/global";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";

@Component({
  selector: 'artist-list',
  imports: [RouterModule],
  templateUrl: '../views/artist-list.html',
  providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity: any;
  public token: string;
  public url: string;
  public next_page: number;
  public prev_page: number;
  public alertMessage: any;
  public confirmado: string | null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _changeDetectorRef: ChangeDetectorRef

  ){
    this.titulo = 'Artistas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artists = [];
    this.next_page = 1;
    this.prev_page = 1;
    this.confirmado = null;
  }

  ngOnInit() {
    console.log('artist-list.component.ts cargado');

    // Conseguir el listado de artistas
    this.getArtists();
  }

  getArtists(){
    this._route.params.forEach((params: Params) => {
      let page = +params['page'];

      if(!page){
        page = 1;
      }else{
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if(this.prev_page == 0){
          this.prev_page = 1;
        }
      }

      this._artistService.getArtists(this.token, page).subscribe({
        next: (res) => {
          if(!res.artists){
            this._router.navigate(['/']);
          }else{
            this.artists = res.artists;
            this._changeDetectorRef.detectChanges();
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
    });
  }

  onDeleteConfirm(id:string){
    this.confirmado = id;
  }

  onCancelArtist(){
    this.confirmado = null
  }

  onDeleteArtist(id:string){
    this._artistService.deleteArtist(this.token, id).subscribe({
      next: (res) => {
          if(!res.artist){
            alert("Error en el servidor");
          }else{
            this.getArtists();
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

