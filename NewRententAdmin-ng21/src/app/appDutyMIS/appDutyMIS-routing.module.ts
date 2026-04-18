// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDutyMISComponent } from './appDutyMIS.component';

const routes: Routes = [
  {
    path: '',
    component: AppDutyMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppDutyMISRoutingModule {}

