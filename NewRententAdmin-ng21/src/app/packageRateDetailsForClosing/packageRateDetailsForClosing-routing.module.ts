// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageRateDetailsForClosingComponent } from './packageRateDetailsForClosing.component';


const routes: Routes = [
  {
    path: '',
    component: PackageRateDetailsForClosingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageRateDetailsForClosingRoutingModule {}
