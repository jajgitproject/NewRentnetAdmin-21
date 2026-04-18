// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationInDetailShowComponent } from './locationInDetailShow.component';

const routes: Routes = [
  {
    path: '',
    component: LocationInDetailShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationInDetailShowRoutingModule {}

