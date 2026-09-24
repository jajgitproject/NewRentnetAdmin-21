// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject } from '@angular/core';
import { ReservationService } from '../../reservation.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Reservation, SavedAddress } from '../../reservation.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SavedAddressDataDropDown } from '../../savedAddressDataDropDown.model';
import { FormDialogComponent } from 'src/app/customerPersonAddress/dialogs/form-dialog/form-dialog.component';
import { CustomerPersonAddress } from 'src/app/customerPersonAddress/customerPersonAddress.model';

@Component({
  standalone: false,
  selector: 'app-saved-address',
  templateUrl: './saved-address.component.html',
  styleUrls: ['./saved-address.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SavedAddressComponent 
{
  advanceTable: SavedAddress | null;
  dataSource: SavedAddress[] | null;
  advanceTableCPA: CustomerPersonAddress | null;  
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  passengerID: any;
  public PassengerDataList?: SavedAddressDataDropDown[] = [];
  PassengerName: string;
  CustomerName: string;
  CustomerGroup: string;
  Mobile: string;
  passenger: any;

  constructor(
  public dialogRef: MatDialogRef<SavedAddressComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ReservationService,
  public _generalService:GeneralService,
  private cdr: ChangeDetectorRef)
  {
    this.passengerID=data.PassengerID;
    this.passenger=data.PassengerName
  }
  public ngOnInit(): void
  {
    this.dataSource = [];
    //this.InitPassengerData();
    this.loadData();
  }

  // InitPassengerData()
  // {
  //   this._generalService.getPassengerData(this.passengerID).subscribe(
  //     data=>
  //     {
  //       this.PassengerDataList=data;
  //       this.PassengerName=this.PassengerDataList[0].customerPersonName;
  //       this.CustomerName=this.PassengerDataList[0].customerName;
  //       this.CustomerGroup=this.PassengerDataList[0].customerGroup;
  //       this.Mobile=this.PassengerDataList[0].primaryMobile;
  //     }
  //   );
  // }

  openCPAddress()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
      {
        width:'60%',
        data: 
          {
            advanceTable: this.advanceTableCPA,
            action: 'add',
            forCPA:'CPA',
            CustomerPersonID:this.passengerID,
            CustomerPersonName:this.passenger
          }
      });
      dialogRef.afterClosed().subscribe(res => {
        // received data from dialog-component
        this.loadData();
      })
  }

  public loadData() 
   {
      const passengerId = Number(this.passengerID);
      if (!passengerId) {
        this.dataSource = [];
        this.cdr.detectChanges();
        return;
      }

      this.advanceTableService.getTableData(passengerId).subscribe
      (
        (data:any) =>   
        {
          this.dataSource = Array.isArray(data) ? data : (data ? [data] : []);
          this.cdr.detectChanges();
        },
        (error: HttpErrorResponse) => 
        { 
          this.dataSource = [];
          this.cdr.detectChanges();
        }
      );
  }

  select(index:any)
  {
    
    this.dialogRef.close({data:this.dataSource[index]});
  }

}

