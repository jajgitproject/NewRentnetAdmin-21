// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendFeedbackMailComponent } from './sendFeedbackMail.component';


const routes: Routes = [
  {
    path: '',
    component: SendFeedbackMailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendFeedbackMailRoutingModule {}

