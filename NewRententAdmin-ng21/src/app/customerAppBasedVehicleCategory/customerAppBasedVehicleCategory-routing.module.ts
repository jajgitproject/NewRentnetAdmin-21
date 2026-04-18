// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerAppBasedVehicleCategoryComponent } from './customerAppBasedVehicleCategory.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerAppBasedVehicleCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAppBasedVehicleCategoryRoutingModule {}

