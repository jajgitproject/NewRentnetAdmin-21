// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncidenceTypeComponent } from './incidenceType.component';

const routes: Routes = [
  {
    path: '',
    component: IncidenceTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenceTypeRoutingModule {}

