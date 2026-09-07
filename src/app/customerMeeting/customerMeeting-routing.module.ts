// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerMeetingComponent } from './customerMeeting.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerMeetingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMeetingRoutingModule {}
