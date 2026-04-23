// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentDutyComponent } from './currentDuty.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentDutyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentDutyRoutingModule {}

