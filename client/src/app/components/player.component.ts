import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Song } from "../models/song";
import { Album } from "../models/album";
import { Artist } from "../models/artist";
import { GLOBAL } from "../services/global";


@Component({
  selector: 'player',
  template: `
  <div class="album-image">
    @if(song.album.image){
      <span><img id="play-image-album" src="{{ url + 'get-image-album/' + song.album.image}}" /></span>
    }@else {
      <span>
        <img id="play-image-album" src="assets/images/default.png" />
      </span>
    }
  </div>

  <div class="audio-file">
    <p>Reproduciendo</p>
    <span id="play-song-title">
      {{song.name}}
    </span>
    |
    @if(song.album.artist){
      <span id="play-song-artist">
        {{song.album.artist.name}}
      </span>
    }
    <audio controls id="player">
      <source id="mp3-source" src="{{url + 'get-song-file/' + song.file}}" type="audio/mpeg" >
      <p>Tu navegador no es compatible con HTML5</p>
    </audio>
  </div>
  `
})

export class PlayerComponent implements OnInit{
  public url: string;
  public song: Song;

  constructor(){
    this.url = GLOBAL.url;
    this.song = new Song('',1,'','','',new Album('','','',1,'',new Artist('','','','')));
  }

  ngOnInit(): void {
    console.log('Player cargado');
    let song = JSON.parse(localStorage.getItem('sound_song')!);
    
    if(song){
      this.song = song
    }else{
      this.song = new Song('',1,'','','',new Album('','','',1,'',new Artist('','','','')));
    }

  }
}
