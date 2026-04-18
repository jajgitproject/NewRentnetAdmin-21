// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TotalBookingCountDetailsComponent } from './totalBookingCountDetails.component';


const routes: Routes = [
  {
    path: '',
    component: TotalBookingCountDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalBookingCountDetailsRoutingModule {}

