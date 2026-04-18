// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmailInfoModel } from './EmailInfo.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
import { EmailInfoService } from './EmailInfo.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-EmailInfo',
  templateUrl: './EmailInfo.component.html',
  styleUrls: ['./EmailInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class EmailInfoComponent {
 emailList: EmailInfoModel[] = [];
  dialogTitle: string;
  reservationID: any;
  hasAnySpecialInstruction = false;
  mergedInstructions: string = "";


  constructor(
    public dialogRef: MatDialogRef<EmailInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _generalService: GeneralService,
    public emailInfoService: EmailInfoService,
  ) {
    // Set the defaults
    this.dialogTitle = 'Email Info';
    this.reservationID = data.reservationID;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() 
  {
    this.loadData();      
  }

  prepareInstructions() 
  {
    const allInstructions: string[] = [];
    this.emailList.forEach(b => {
      if (b.specialInstruction && Array.isArray(b.specialInstruction)) {
        b.specialInstruction.forEach(ins => {
          if (ins.specialInstruction) {
            allInstructions.push(ins.specialInstruction);
          }
        });
      }
    });

    this.hasAnySpecialInstruction = allInstructions.length > 0;

    if (this.hasAnySpecialInstruction) 
    {
      this.mergedInstructions = allInstructions.join(", ");
    }
  }

  public loadData() 
  {
    this.emailInfoService.getData(this.reservationID).subscribe(
    data =>   
    {
      this.emailList = data;
      if(this.emailList && this.emailList.length>0)
      {
        this.prepareInstructions();
      }
    },
    (error: HttpErrorResponse) => { this.emailList = null;});
  }
    
  copyEmail() {
  const content = document.getElementById('emailContent');
  if (!content) return;

  const range = document.createRange();
  range.selectNode(content);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
    selection.removeAllRanges();
    //alert('Email content copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

}


