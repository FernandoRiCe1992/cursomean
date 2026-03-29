import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

//import Home
import { HomeComponent } from './components/home.component';

//import user
import { UserEditComponent } from './components/user-edit.component';

//import Artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//import Album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

// import Song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artistas/:page', component: ArtistListComponent},
  {path: 'crear-artista', component: ArtistAddComponent},
  {path: 'editar-artista/:id', component: ArtistEditComponent},
  {path: 'artista/:id', component: ArtistDetailComponent},
  {path: 'crear-album/:artist', component: AlbumAddComponent},
  {path: 'editar-album/:id', component: AlbumEditComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'crear-tema/:album', component: SongAddComponent},
  {path: 'editar-tema/:id', component: SongEditComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];
