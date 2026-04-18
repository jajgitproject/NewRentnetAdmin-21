// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeCarTypeComponent } from './changeCarType.component';


const routes: Routes = [
  {
    path: '',
    component: ChangeCarTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeCarTypeRoutingModule {}

