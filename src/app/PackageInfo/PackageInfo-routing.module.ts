// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageInfoComponent } from './PackageInfo.component';

const routes: Routes = [
  {
    path: '',
    component: PackageInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageInfoRoutingModule {}

