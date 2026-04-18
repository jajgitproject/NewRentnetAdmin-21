// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropOffDetailShowComponent } from './dropOffDetailShow.component';

const routes: Routes = [
  {
    path: '',
    component: DropOffDetailShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DropOffDetailShowRoutingModule {}

