// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AddStopService } from '../../addStop.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AddStop } from '../../addStop.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogAddStopComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AddStop;
  idForReservation:any;


  dataSource: AddStop[] | null;
  addStopID: number = 0;
  reservationID:number=0;
  stopType:string='null';
  AddStopID: number = 0;
  SearchActivationStatus : string='Active';
  PageNumber: number = 0;


  constructor(
  public dialogRef: MatDialogRef<FormDialogAddStopComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AddStopService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.idForReservation=data.IDForReservation;
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Add Pickup';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Add Pickup';
          this.advanceTable = new AddStop({});
          this.advanceTable.activationStatus="Active";
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  formattedAddress ='';
  options={
    componentRestrictions :{
      country:['IN']
    }
  }

  public handleAddressChange(address: any) {
    debugger;
    let tempCity = null;
    address.address_components.forEach(element => {
      if(element.types[0] == 'locality' && tempCity == null) {
        tempCity = element.long_name;
      } 
      else if(element.types[0] == 'administrative_area_level_1' && tempCity == null) {
        tempCity = element.long_name;
      }
    });
    this.formattedAddress = tempCity;
     //this.formattedAddress = address.formatted_address;
     this.advanceTableForm.controls.stopAddressGeoLocation.setValue(address.formatted_address);
   this.advanceTable.stopAddressGeoLocation = address.formatted_address;
   this.formattedAddress='';
 //  this.advanceTable.stopAddressGeoLocation='';
   this.formattedAddress=address.formatted_address;
   //this.advanceTable.stopAddressGeoLocation=this.formattedAddress;
  }
  

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      addStopID: [this.advanceTable.addStopID],
      reservationID: [this.advanceTable.reservationID],
      stopCityID: [1],
      stopAddress: [this.advanceTable.stopAddress],
      stopAddressGeoLocation: [this.advanceTable.stopAddressGeoLocation],
      //location: [this.advanceTable.stopAddressGeoLocation],
      stopLongitude: ['80.9462'],
      stopLatitude: ['26.8467'],
      stopSpotID: [3],
      stopDate: [this.advanceTable.stopDate],
      stopTime: [this.advanceTable.stopTime],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      updateDateTime: [this.advanceTable.updateDateTime]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


  submit() 
  {
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    //debugger;

  // this.advanceTableForm.patchValue({ cityGeoName: this.advanceTable.cityGeoName });
   this.advanceTableForm.patchValue({ stopAddressGeoLocation: this.advanceTable.stopAddressGeoLocation });
    this.advanceTableForm.patchValue({ reservationID: this.idForReservation });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
      if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('AddStopCreate:AddStopView:Success');//To Send Updates 
       } 
      
    },
    error =>
    { 
      debugger
      this.showError = error;
      //alert(error);
      this._generalService.sendUpdate('AddStopAll:AddStopView:Failure');//To Send Updates  
    }
  )
  //location.reload();
  // this.loadDataFD();
  this.SubscribeUpdateService()
  }
  public Put(): void
  {
    debugger;
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
        //this.SubscribeUpdateService();
       this._generalService.sendUpdate('AddStopUpdate:AddStopView:Success');//To Send Updates  
       } 
    },
    error =>
    {
     this._generalService.sendUpdate('AddStopAll:AddStopView:Failure');//To Send Updates  
    }
  )
this.SubscribeUpdateService();
  }
  public confirmAdd(): void 
  {
    debugger;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }

  public loadDataFD() 
  {
    debugger;
    this.reservationID=this.idForReservation
     this.advanceTableService.getTableData( this.reservationID,this.addStopID,this.stopType,this.SearchActivationStatus, this.PageNumber).subscribe
   (
     data =>   
     {
       this.dataSource = data;
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }


  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    debugger;
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="AddStopCreate")
          {
            if(this.MessageArray[1]=="AddStopView")
            {
              if(this.MessageArray[2]=="Success")
              {
                //this.refresh();
                this.showNotification(
                'snackbar-success',
                'AddStop Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AddStopUpdate")
          {
            if(this.MessageArray[1]=="AddStopView")
            {
              if(this.MessageArray[2]=="Success")
              {
               //this.refresh();
               this.showNotification(
                'snackbar-success',
                'AddStop Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AddStopDelete")
          {
            if(this.MessageArray[1]=="AddStopView")
            {
              if(this.MessageArray[2]=="Success")
              {
               //this.refresh();
               this.showNotification(
                'snackbar-success',
                'Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AddStopAll")
          {
            if(this.MessageArray[1]=="AddStopView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               //this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               //this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Duplicate Value Found.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
        }
      }
    );
  }
}


