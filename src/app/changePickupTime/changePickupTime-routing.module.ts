// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePickupTimeComponent } from './changePickupTime.component';


const routes: Routes = [
  {
    path: '',
    component: ChangePickupTimeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePickupTimeRoutingModule {}

