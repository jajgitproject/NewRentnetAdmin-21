import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuelEntryMISComponent } from './fuelEntryMIS.component';

const routes: Routes = [{ path: '', component: FuelEntryMISComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelEntryMISRoutingModule {}
