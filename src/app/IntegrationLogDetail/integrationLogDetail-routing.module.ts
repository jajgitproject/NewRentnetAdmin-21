// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrationLogDetailComponent } from './integrationLogDetail.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationLogDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationLogDetailRoutingModule {}

