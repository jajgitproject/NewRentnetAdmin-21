// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DropOffDetailsService } from '../../dropOffDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DropOffDetails } from '../../dropOffDetails.model';
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

export class FormDialogDropOffDetailsComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DropOffDetails;
  idForReservation:any;


  dataSource: DropOffDetails[] | null;
  dropOffDetailsID: number = 0;
  reservationID:number=0;
  stopType:string='null';
  DropOffDetailsID: number = 0;
  SearchActivationStatus : string='Active';
  PageNumber: number = 0;


  constructor(
  public dialogRef: MatDialogRef<FormDialogDropOffDetailsComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DropOffDetailsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.idForReservation=data.IDForReservation;
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='DropOff Details';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'DropOff Details';
          this.advanceTable = new DropOffDetails({});
          this.advanceTable.activationStatus="Active";
          this.advanceTable.date="21-08-2023";
          this.advanceTable.time="11:22 Am";
          this.advanceTable.country="India";
          this.advanceTable.state="Uttar Pardesh"; 
          this.advanceTable.cityGroup="Delhi&NCR";
          this.advanceTable.city="Noida";
          this.advanceTable.googleAddressString="Demo";
          this.advanceTable.dropOffDetails="Sector 62 Noida";      
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
      date:[this.advanceTable.date],
      time:[this.advanceTable.time],
      country:[this.advanceTable.country],
      state:[this.advanceTable.state],
      googleAddressString:[this.advanceTable.googleAddressString],
      cityGroup:[this.advanceTable.cityGroup],
      city:[this.advanceTable.city],
      dropOffDetails:[this.advanceTable.dropOffDetails],
      dropOffDetailsID: [this.advanceTable.dropOffDetailsID],
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
       this._generalService.sendUpdate('DropOffDetailsCreate:DropOffDetailsView:Success');//To Send Updates 
       } 
      
    },
    error =>
    { 
      debugger
      this.showError = error;
      //alert(error);
      this._generalService.sendUpdate('DropOffDetailsAll:DropOffDetailsView:Failure');//To Send Updates  
    }
  )
  //location.reload();
  // this.loadDataFD();
  this.SubscribeUpdateService()
  }
  public Put(): void
  {
    
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
       this._generalService.sendUpdate('DropOffDetailsUpdate:DropOffDetailsView:Success');//To Send Updates  
       } 
    },
    error =>
    {
     this._generalService.sendUpdate('DropOffDetailsAll:DropOffDetailsView:Failure');//To Send Updates  
    }
  )
this.SubscribeUpdateService();
  }
  public confirmAdd(): void 
  {
    
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
    
    this.reservationID=this.idForReservation
     this.advanceTableService.getTableData( this.reservationID,this.dropOffDetailsID,this.stopType,this.SearchActivationStatus, this.PageNumber).subscribe
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
    
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="DropOffDetailsCreate")
          {
            if(this.MessageArray[1]=="DropOffDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                //this.refresh();
                this.showNotification(
                'snackbar-success',
                'DropOffDetails Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DropOffDetailsUpdate")
          {
            if(this.MessageArray[1]=="DropOffDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               //this.refresh();
               this.showNotification(
                'snackbar-success',
                'DropOffDetails Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DropOffDetailsDelete")
          {
            if(this.MessageArray[1]=="DropOffDetailsView")
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
          else if(this.MessageArray[0]=="DropOffDetailsAll")
          {
            if(this.MessageArray[1]=="DropOffDetailsView")
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


