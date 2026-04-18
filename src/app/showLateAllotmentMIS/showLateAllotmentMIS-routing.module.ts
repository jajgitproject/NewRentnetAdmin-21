// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowLateAllotmentMISComponent } from './showLateAllotmentMIS.component';

const routes: Routes = [
  {
    path: '',
    component: ShowLateAllotmentMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowLateAllotmentMISRoutingModule {}

