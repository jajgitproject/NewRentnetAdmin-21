// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickUpDetailShowComponent } from './pickUpDetailShow.component';

const routes: Routes = [
  {
    path: '',
    component: PickUpDetailShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickUpDetailShowRoutingModule {}

