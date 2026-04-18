// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverRemarkDetailsComponent } from './DriverRemarkDetails.component';
// import { DriverRemarkDetailsComponent } from './DriverRemarkDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DriverRemarkDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRemarkDetailsRoutingModule {}

