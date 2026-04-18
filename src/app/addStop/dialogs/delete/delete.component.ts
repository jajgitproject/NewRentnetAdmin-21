// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AddStopService } from '../../addStop.service';
import { GeneralService } from '../../../general/general.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AddStopService,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.addStopID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('AddStopDelete:AddStopView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('AddStopAll:AddStopView:Failure');//To Send Updates  
    }
    )
    this.SubscribeUpdateService();
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
           if(this.MessageArray[0]=="AddStopDelete")
          {
            if(this.MessageArray[1]=="AddStopView")
            {
              if(this.MessageArray[2]=="Success")
              {
              //  this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Reservation Stop Deleted Successfully...!!!',
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
              //  this.refresh();
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
              //  this.refresh();
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


