// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherFieldsComponent } from './otherFields.component';

const routes: Routes = [
  {
    path: '',
    component: OtherFieldsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherFieldsRoutingModule {}

