// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendCreditNotesToDynamicsComponent } from './sendCreditNotesToDynamics.component';

const routes: Routes = [
  {
    path: '',
    component: SendCreditNotesToDynamicsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendCreditNotesToDynamicsRoutingModule {}
