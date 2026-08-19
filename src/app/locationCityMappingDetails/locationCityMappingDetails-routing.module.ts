// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationCityMappingDetailsComponent } from './locationCityMappingDetails.component';

const routes: Routes = [
  {
    path: '',
    component: LocationCityMappingDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationCityMappingDetailsRoutingModule {}
