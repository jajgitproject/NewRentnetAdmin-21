// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModeOfPaymentChangeComponent } from './modeOfPaymentChanges.component';


const routes: Routes = [
  {
    path: '',
    component: ModeOfPaymentChangeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeOfPaymentChangeRoutingModule {}

