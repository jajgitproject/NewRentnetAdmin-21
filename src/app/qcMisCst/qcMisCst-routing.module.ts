// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QcMisCSTComponent } from './qcMisCst.component';

const routes: Routes = [
  {
    path: '',
    component: QcMisCSTComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QcMisCSTRoutingModule {}
