// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SACComponent } from './sac.component';

const routes: Routes = [
  {
    path: '',
    component: SACComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SACRoutingModule {}

