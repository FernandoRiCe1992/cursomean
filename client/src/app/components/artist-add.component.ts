import { Component, OnInit } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { GLOBAL } from "../services/global";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";

@Component({
  selector: 'artist-add',
  imports: [RouterModule, FormsModule],
  templateUrl: '../views/artist-add.html',
  providers: [UserService]
})

export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity: any;
  public token: string;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.titulo = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
  }

  ngOnInit() {
    console.log('artist-add.component.ts cargado');

    // Conseguir el listado de artistas
  }

  onSubmit(){

  }

}

