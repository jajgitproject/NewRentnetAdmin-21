// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KamCardComponent } from './kamCard.component';

const routes: Routes = [
  {
    path: '',
    component: KamCardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KamCardRoutingModule {}

