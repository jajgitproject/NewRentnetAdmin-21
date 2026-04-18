// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowLateDispatchMISComponent } from './showLateDispatchMIS.component';

const routes: Routes = [
  {
    path: '',
    component: ShowLateDispatchMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowLateDispatchMISRoutingModule {}

