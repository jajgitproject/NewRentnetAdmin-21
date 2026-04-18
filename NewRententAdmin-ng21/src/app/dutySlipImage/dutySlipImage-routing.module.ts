// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipImageComponent } from './dutySlipImage.component';


const routes: Routes = [
  {
    path: '',
    component: DutySlipImageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipImageRoutingModule {}

