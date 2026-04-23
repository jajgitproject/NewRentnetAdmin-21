// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickUpByExecutiveComponent } from './pickUpByExecutive.component';


const routes: Routes = [
  {
    path: '',
    component: PickUpByExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickUpByExecutiveRoutingModule {}

