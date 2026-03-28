import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

//import Home
import { HomeComponent } from './components/home.compponent';

//import user
import { UserEditComponent } from './components/user-edit.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artistas/:page', component: ArtistListComponent},
  {path: 'crear-artista', component: ArtistAddComponent},
  {path: 'editar-artista/:id', component: ArtistEditComponent},
  {path: 'artista/:id', component: ArtistDetailComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];
