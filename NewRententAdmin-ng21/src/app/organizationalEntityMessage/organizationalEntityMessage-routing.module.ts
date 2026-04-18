// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationalEntityMessageComponent } from './organizationalEntityMessage.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationalEntityMessageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalEntityMessageRoutingModule {}

