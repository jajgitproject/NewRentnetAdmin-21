// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendDataToMyfComponent } from './sendDataToMyf.component';

const routes: Routes = [
  {
    path: '',
    component: SendDataToMyfComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendDataToMyfRoutingModule {}
