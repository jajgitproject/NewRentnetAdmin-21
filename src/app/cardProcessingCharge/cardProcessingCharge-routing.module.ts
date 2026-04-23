// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardProcessingChargeComponent } from './cardProcessingCharge.component';

const routes: Routes = [
  {
    path: '',
    component: CardProcessingChargeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardProcessingChargeRoutingModule {}

