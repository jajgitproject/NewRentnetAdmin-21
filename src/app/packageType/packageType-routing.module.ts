// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageTypeComponent } from './packageType.component';

const routes: Routes = [
  {
    path: '',
    component: PackageTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageTypeRoutingModule {}

