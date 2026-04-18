// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlPanelDesignComponent } from './controlPanelDesign.component';

const routes: Routes = [
  {
    path: '',
    component: ControlPanelDesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelDesignRoutingModule {}

