// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncidenceEmailToBeSentToComponent } from './incidenceEmailToBeSentTo.component';

const routes: Routes = [
  {
    path: '',
    component: IncidenceEmailToBeSentToComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenceEmailToBeSentToRoutingModule {}
