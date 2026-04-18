// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherDetailsComponent } from './otherDetails.component';

const routes: Routes = [
  {
    path: '',
    component: OtherDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherDetailsRoutingModule {}

