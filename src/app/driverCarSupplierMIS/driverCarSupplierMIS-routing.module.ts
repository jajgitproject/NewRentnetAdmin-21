// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverCarSupplierMISComponent } from './driverCarSupplierMIS.component';



const routes: Routes = [
  {
    path: '',
    component: DriverCarSupplierMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverCarSupplierMISRoutingModule {}

