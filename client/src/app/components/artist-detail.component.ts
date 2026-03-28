import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Artist } from '../models/artist';
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";

@Component({
  selector: 'artist-detail',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/artist-detail.html',
  providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements OnInit {
  public artist: Artist;
  public identity: any;
  public token: string;
  public url: string;
  public alertMessage:any;
  public is_edit:boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _changeDetectorRef: ChangeDetectorRef
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = this.identity;
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('artist-detail.component.ts cargado');

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

            // Sacar los albums del artista

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
}

