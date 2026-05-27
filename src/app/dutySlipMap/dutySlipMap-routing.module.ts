// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipMapComponent } from './dutySlipMap.component';


const routes: Routes = [
  {
    path: '',
    component:DutySlipMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipMapRoutingModule {}

