// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlPanelTempComponent } from './controlPanelTemp.component';

const routes: Routes = [
  {
    path: '',
    component: ControlPanelTempComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelTempRoutingModule {}

