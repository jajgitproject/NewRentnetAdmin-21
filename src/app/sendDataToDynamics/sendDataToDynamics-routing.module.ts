// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendDataToDynamicsComponent } from './sendDataToDynamics.component';

const routes: Routes = [
  {
    path: '',
    component: SendDataToDynamicsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendDataToDynamicsRoutingModule {}
