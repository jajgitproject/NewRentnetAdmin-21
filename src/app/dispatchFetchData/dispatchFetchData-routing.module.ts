// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchFetchDataComponent } from './dispatchFetchData.component';

const routes: Routes = [
  {
    path: '',
    component: DispatchFetchDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchFetchDataRoutingModule {}

