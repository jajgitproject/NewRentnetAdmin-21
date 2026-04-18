// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarAndDriverActionsComponent } from './CarAndDriverActions.component';

const routes: Routes = [
  {
    path: '',
    component: CarAndDriverActionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarAndDriverActionsRoutingModule {}

