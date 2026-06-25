// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncidenceMISComponent } from './incidenceMIS.component';

const routes: Routes = [
  {
    path: '',
    component: IncidenceMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenceMISRoutingModule {}
