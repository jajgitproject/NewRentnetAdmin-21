// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TallyMis20Component } from './tallyMis.component';


const routes: Routes = [
  {
    path: '',
    component: TallyMis20Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TallyMis20RoutingModule {}

