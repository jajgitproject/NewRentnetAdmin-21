// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClosingDetailShowComponent } from './closingDetailShow.component';

const routes: Routes = [
  {
    path: '',
    component: ClosingDetailShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClosingDetailShowRoutingModule {}

