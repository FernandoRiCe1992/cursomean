import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

//import Home
import { HomeComponent } from './components/home.compponent';

//import user
import { UserEditComponent } from './components/user-edit.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artistas/:page', component: ArtistListComponent},
  {path: 'crear-artista', component: ArtistAddComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: HomeComponent}
];
