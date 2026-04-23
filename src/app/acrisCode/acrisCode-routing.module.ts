// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcrisCodeComponent } from './acrisCode.component';

const routes: Routes = [
  {
    path: '',
    component: AcrisCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcrisCodeRoutingModule {}

