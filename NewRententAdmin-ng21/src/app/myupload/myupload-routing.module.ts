// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyUploadComponent } from './myupload.component';

const routes: Routes = [
  {
    path: '',
    component: MyUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyUploadRoutingModule {}

