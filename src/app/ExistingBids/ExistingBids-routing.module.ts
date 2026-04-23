// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExistingBidsComponent } from './ExistingBids.component';

const routes: Routes = [
  {
    path: '',
    component: ExistingBidsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExistingBidsRoutingModule {}

