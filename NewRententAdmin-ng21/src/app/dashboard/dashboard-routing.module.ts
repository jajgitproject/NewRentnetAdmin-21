// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { TestComponent } from './test/test.component';
import { AdvanceTableTestComponent } from './advance-table-test/advance-table-test.component';
import { EmployeeCrudComponent } from './employee-crud/employee-crud.component';
import { CityMasterComponent } from './city-master/city-master.component';
//import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component
  },
  {
    path: 'dashboard3',
    component: Dashboard3Component
  },
  {
    path: 'test',
    component: TestComponent
  },
  
  {
    path: 'advancetabletest',
    component: AdvanceTableTestComponent
  },  
   {
    path:'EmployeeCrud',
    component:EmployeeCrudComponent
   },
   {
    path:'CityMaster',
    component:CityMasterComponent
   },
  
  //  {
  //   path:'Users',
  //   component:UsersComponent
  //  },
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}

