// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassengerHistoryComponent } from './PassengerHistory.component';

const routes: Routes = [
  {
    path: '',
    component: PassengerHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerHistoryRoutingModule {}

