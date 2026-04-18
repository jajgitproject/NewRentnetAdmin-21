// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentdataInformationComponent } from './currentdata-information.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentdataInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentDataInformationRoutingModule {}

