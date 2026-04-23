// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageTypeComponent } from './messageType.component';

const routes: Routes = [
  {
    path: '',
    component: MessageTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageTypeRoutingModule {}

