// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarAndDriverSearchComponent } from './CarAndDriverSearch.component';

const routes: Routes = [
  {
    path: '',
    component: CarAndDriverSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarAndDriverSearchRoutingModule {}

