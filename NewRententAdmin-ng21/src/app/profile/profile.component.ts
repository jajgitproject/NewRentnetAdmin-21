// @ts-nocheck
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';


@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  displayedColumns = [
    'userName',
    'gender',
    'organizationalEntityName',
    'department',
    'designation',
    'phone',
    'email',
    'employeeNumber',
  ];

  dataSource: Profile[] | null;
  LoginUserID: number;
  advanceTable: Profile | null;
  firstName: any;
  lastName: any;
  gender: any;
  SupplierName: any;
  mobile: any;
  email: any;
  employeeOfficeID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public profileService: ProfileService,
    public _generalService: GeneralService,
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
    // this.loginUserAddress();
  }

  refresh() {
    this.LoginUserID = 0;
    this.loadData();
  }

  public loadData() {  
    this.LoginUserID = this._generalService.getUserID();
    this.profileService.getTableData(this.LoginUserID).subscribe
      (
        data => {
            this.dataSource = data;
           this.firstName = data.firstName;
           this.lastName = data.lastName;
           this.gender = data.gender;
           this.SupplierName=data.supplierName;
           this.mobile = data.mobile;
           this.email = data.email;
           this.employeeOfficeID = data.employeeOfficeID;
          },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

 
  
}


