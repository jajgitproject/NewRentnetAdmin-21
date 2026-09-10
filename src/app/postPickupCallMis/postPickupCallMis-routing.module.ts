// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostPickupCallMisComponent } from './postPickupCallMis.component';

const routes: Routes = [
  {
    path: '',
    component: PostPickupCallMisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostPickupCallMisRoutingModule {}
