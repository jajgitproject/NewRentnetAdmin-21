// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IternallinformationComponent } from './internal-information.component';


const routes: Routes = [
  {
    path: '',
    component: IternallinformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IternallinformationRoutingModule {}

