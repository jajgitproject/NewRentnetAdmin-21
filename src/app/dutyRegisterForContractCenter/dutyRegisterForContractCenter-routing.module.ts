// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyRegisterForContractCenterComponent } from './dutyRegisterForContractCenter.component';

const routes: Routes = [
  {
    path: '',
    component: DutyRegisterForContractCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyRegisterForContractCenterRoutingModule {}
