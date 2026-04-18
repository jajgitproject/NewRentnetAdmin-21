// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlPanelDialogeComponent } from './controlPanelDialoge.component';


const routes: Routes = [
  {
    path: '',
    component: ControlPanelDialogeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelDialogeRoutingModule {}

