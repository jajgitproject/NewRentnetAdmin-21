import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicsSyncBatchComponent } from './dynamicsSyncBatch.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicsSyncBatchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicsSyncBatchRoutingModule {}
