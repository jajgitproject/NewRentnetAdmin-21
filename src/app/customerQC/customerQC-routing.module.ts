// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerQCComponent } from './customerQC.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerQCComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerQCRoutingModule {}

