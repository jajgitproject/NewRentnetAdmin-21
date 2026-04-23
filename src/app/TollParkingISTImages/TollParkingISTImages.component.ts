// @ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { TollParkingISTImages } from './TollParkingISTImages.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { TollParkingISTImagesService } from './TollParkingISTImages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-TollParkingISTImages',
  templateUrl: './TollParkingISTImages.component.html',
  styleUrls: ['./TollParkingISTImages.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TollParkingISTImagesComponent {
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;
  public response: { dbPath: '' };
  tollImage: Object;
  parkingImage: Object;
  istImage: Object;
  ltrStatementID: any;
  action: any;

  constructor(
    public dialogRef: MatDialogRef<TollParkingISTImagesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public _tollParkingISTImagesService: TollParkingISTImagesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.ltrStatementID=data.ltrStatementID;
    this.action=data.action;
  }

  formControl = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  ngOnInit() {
    if(this.action==='toll')
    {
      this.getTollImages();
    }
    if(this.action==='parking')
    {
      this.getTParkingImages();
    }
    if(this.action==='ist')
    {
      this.getISTImages();
    }
  }

  getTollImages()
  {
    this._tollParkingISTImagesService.getTollImages(this.ltrStatementID).subscribe(
      (data:any)=>
        {
          this.tollImage=data.result;
        }
      );
  }

  getTParkingImages()
  {
    this._tollParkingISTImagesService.getTParkingImages(this.ltrStatementID).subscribe(
      (data:any)=>
        {
          this.parkingImage=data.result;
        }
      );
  }

  getISTImages()
  {
    this._tollParkingISTImagesService.getISTImages(this.ltrStatementID).subscribe(
      (data:any)=>
        {
          this.istImage=data.result;
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openImageInNewTab(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }
}


