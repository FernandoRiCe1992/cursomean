import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

//import user
import { UserEditComponent } from './components/user-edit.component';

export const routes: Routes = [
  {path: '', component: UserEditComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: UserEditComponent}
];
