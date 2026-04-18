// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePassengerComponent } from './changePassenger.component';

const routes: Routes = [
  {
    path: '',
    component: ChangePassengerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePassengerRoutingModule {}

