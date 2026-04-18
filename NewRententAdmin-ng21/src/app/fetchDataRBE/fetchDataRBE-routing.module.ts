// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FetchDataRBEComponent } from './fetchDataRBE.component';

const routes: Routes = [
  {
    path: '',
    component: FetchDataRBEComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FetchDataRBERoutingModule {}

