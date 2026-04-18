// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesPersonComponent } from './salesPerson.component';

const routes: Routes = [
  {
    path: '',
    component: SalesPersonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPersonRoutingModule {}

