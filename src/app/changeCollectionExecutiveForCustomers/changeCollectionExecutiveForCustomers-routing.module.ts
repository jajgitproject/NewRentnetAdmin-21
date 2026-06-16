// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeCollectionExecutiveForCustomersComponent } from './changeCollectionExecutiveForCustomers.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeCollectionExecutiveForCustomersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeCollectionExecutiveForCustomersRoutingModule {}
