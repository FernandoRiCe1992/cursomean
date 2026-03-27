import { Component, OnInit } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";

@Component({
  selector: 'artist-list',
  imports: [RouterModule],
  templateUrl: '../views/artist-list.html',
  providers: [UserService]
})

export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity: any;
  public token: string;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.titulo = 'Artistas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artists = [];
  }

  ngOnInit() {
    console.log('artist-list.component.ts cargado');

    // Conseguir el listado de artistas
  }

}

