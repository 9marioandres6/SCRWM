import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncisesComponent } from './components/incises/incises.component';
import { InitComponent } from './components/init/init.component';

const routes: Routes = [
  /*{
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },*/
  {
    path: '',
    component: InitComponent,
  },
  {
    path: 'incises',            
    component: IncisesComponent,
  },
  {
    path: 'incises/:_id',            
    component: IncisesComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
