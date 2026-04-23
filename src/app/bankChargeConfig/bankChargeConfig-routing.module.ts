// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankChargeConfigComponent } from './bankChargeConfig.component';

const routes: Routes = [
  {
    path: '',
    component: BankChargeConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankChargeConfigRoutingModule {}

