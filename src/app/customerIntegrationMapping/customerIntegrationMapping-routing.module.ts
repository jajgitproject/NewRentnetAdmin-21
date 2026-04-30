// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerIntegrationMappingComponent } from './customerIntegrationMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerIntegrationMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerIntegrationMappingRoutingModule {}

