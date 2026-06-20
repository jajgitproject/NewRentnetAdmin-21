
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddB2CServiceLocationComponent } from './addB2CServiceLocation.component';

const routes: Routes = [
  {
    path: '',
    component: AddB2CServiceLocationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddB2CServiceLocationRoutingModule {}

