// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AllotCarAndDriverService } from '../../allotCarAndDriver.service';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  standalone: false,
    selector: 'app-showError',
    templateUrl: './showError.component.html',
    styleUrls: ['./showError.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class ShowErrorComponent implements OnInit {
 message : string;
  constructor(
    public dialogRef: MatDialogRef<ShowErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AllotCarAndDriverService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService) {
      this.message = data.message;
  }
  

  ngOnInit(): void {
  }



 
}


