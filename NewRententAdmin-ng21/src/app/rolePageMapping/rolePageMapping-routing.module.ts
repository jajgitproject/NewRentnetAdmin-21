// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolePageMappingComponent } from './rolePageMapping.component';

const routes: Routes = [
  {
    path: '',
    component: RolePageMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolePageMappingRoutingModule {}

