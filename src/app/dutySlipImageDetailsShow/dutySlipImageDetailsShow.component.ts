// @ts-nocheck
import {
  Component,
  Inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { DutySlipImageDetailsShowService }
  from './dutySlipImageDetailsShow.service';

import { DutySlipImageDetailsShow }
  from './dutySlipImageDetailsShow.model';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-dutySlipImageDetailsShow',
  templateUrl: './dutySlipImageDetailsShow.component.html',
  styleUrls: ['./dutySlipImageDetailsShow.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class DutySlipImageDetailsShowComponent {

  dialogTitle: string = 'Duty Slip Image Details';
  dutySlipID: number;
  dataSource!: DutySlipImageDetailsShow;

  imageUrl: string = '';
  public isPdf: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DutySlipImageDetailsShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dutySlipImageDetailsShowService:
      DutySlipImageDetailsShowService,
        private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit(): void {
    this.DutySlipImageLoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openImageInNewTab(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  public DutySlipImageLoadData() {
    this.dutySlipImageDetailsShowService
      .getDutySlipImageData(this.dutySlipID)
      .subscribe({
        next: (data: DutySlipImageDetailsShow) => {

          this.dataSource = data;
          

          // Delay assignment to next cycle
          setTimeout(() => {
            this.imageUrl =
              data?.dutySlipImage || '';
              console.log('Image URL:', this.imageUrl);
            if(this.imageUrl?.toLowerCase().endsWith('.pdf'))
            {
              this.isPdf = true;
              console.log(this.isPdf);
            }
            this.cdr.detectChanges();
          });

            
        },

        error: (error: HttpErrorResponse) => {
          this.imageUrl = '';
        }
      });
  }
  deleteImage() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No'
    }).then((result) => {

     if (result.isConfirmed) {

  this.dutySlipImageDetailsShowService
    .delete(this.dutySlipID)
    .subscribe(
      data => {

        // First show message
        this.showNotification(
          'snackbar-success',
          'Duty Slip Image Deleted...!!!',
          'bottom',
          'center'
        );

        // Delay dialog close
        setTimeout(() => {
          this.dialogRef.close(data);
        }, 1000);
      },
      error => {

        this.showNotification(
          'snackbar-danger',
          'Operation Failed.....!!!',
          'bottom',
          'center'
        );
      }
    );
}
    })
  }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  hasImage(): boolean {
  return !!this.imageUrl &&
         this.imageUrl !== 'https://localhost:44368/StaticFiles/Images/';
}

}