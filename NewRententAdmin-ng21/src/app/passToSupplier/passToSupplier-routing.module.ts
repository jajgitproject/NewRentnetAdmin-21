// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassToSupplierComponent } from './passToSupplier.component';

const routes: Routes = [
  {
    path: '',
    component: PassToSupplierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassToSupplierRoutingModule {}

