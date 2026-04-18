// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PageService } from '../../page.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { Page } from '../../page.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ParentMenuDropDown } from '../../../general/parentMenuDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PageGroupDropDown } from 'src/app/pageGroup/pageGroupDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Page;
  public ParentMenuList?: ParentMenuDropDown[] = [];
  filteredPageOptions: Observable<ParentMenuDropDown[]>;
  pageID: any;
filteredPageGroupOptions: Observable<PageGroupDropDown[]>;
public PageGroupList?: PageGroupDropDown[] = [];
  pageGroupID: any;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PageService,
  private fb: FormBuilder,
  private _generalService: GeneralService) 
  {
        // Set the defaults
        this.action = data.action;
        console.log(data)
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Page';       
          this.advanceTable = data.advanceTable;
          console.log(this.advanceTable)
        } 
        else 
        {
          this.dialogTitle = 'Page';
          this.advanceTable = new Page({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
        this.InitParentMenu();
        this.InitPageGroup();
  }

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      pageID: [this.advanceTable.pageID],
      page: [this.advanceTable.page],
      
      path: [this.advanceTable.path],
      title: [this.advanceTable.title,Validators.required],
      moduleName: [this.advanceTable.moduleName,Validators.required],
      icon: [this.advanceTable.icon],
      class: [this.advanceTable.class],
      groupTitle: [this.advanceTable.groupTitle],
      menuIndex: [this.advanceTable.menuIndex,Validators.required],
      parentMenuID: [this.advanceTable.parentMenuID],
      parentMenuName : [this.advanceTable.parentMenuName],
      isItTopMenu: [this.advanceTable.isItTopMenu,Validators.required],
      remark : [this.advanceTable.remark],
      activationStatus: [this.advanceTable.activationStatus],
      pageGroup:[this.advanceTable.pageGroup],
      pageGroupID:[this.advanceTable.pageGroupID]
     
    });
  }

  InitParentMenu(){
    this._generalService.GetParentMenus().subscribe(
      data=>
      {
        this.ParentMenuList = data;
          // this.advanceTableForm.controls['page'].setValidators([Validators.required,
          // this.pageSelectionValidator()
          // ]);
          this.advanceTableForm.controls['page'].updateValueAndValidity();
        this.filteredPageOptions =this.advanceTableForm.controls['page'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        ); 
      });
  }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    if (!value || value.length < 0) {
        return [];   
      }
    return this.ParentMenuList.filter(
      page => 
      {
        return page.page.toLowerCase().indexOf(filteringValue)===0;
      }
    );
  }

  getTitles(pageID: any) {
    this.pageID=pageID;
    this.advanceTableForm.patchValue({pageID:this.pageID});
  }

  pageSelectionValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) return null;

    const match = this.ParentMenuList?.find(
      x => x.page.toLowerCase() === control.value.toLowerCase()
    );

    return match ? null : { invalidPage: true };
  };
}
    InitPageGroup() {
      this.advanceTableService.GetPageGroup().subscribe(
        data => {
          this.PageGroupList = data;
          this.advanceTableForm.controls['pageGroup'].setValidators([Validators.required,
          this.PageValidator(this.PageGroupList)
          ]);
          this.advanceTableForm.controls['pageGroup'].updateValueAndValidity();
          this.filteredPageGroupOptions = this.advanceTableForm.controls["pageGroup"].valueChanges.pipe(
            startWith(""),
            map(value => this._filterPageGroup(value || ''))
          );
        },
        error => {
  
        }
      );
    }
    private _filterPageGroup(value: string): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 0) {
        return [];   
      }
      return this.PageGroupList.filter(
        customer => {
          return customer.pageGroup.toLowerCase().includes(filterValue);
        });
    }
    OnPageGroupSelect(selectedPageGroup: string)
    {
      const PageGroupName = this.PageGroupList.find(
        data => data.pageGroup === selectedPageGroup
      );
      if (selectedPageGroup) 
      {
        this.getPageGroupID(PageGroupName.pageGroupID);
      }
    }
    getPageGroupID(pageGroupID: any)
    {
      this.pageGroupID = pageGroupID;
      this.advanceTableForm.patchValue({pageGroupID:this.pageGroupID});
    }
  
    PageValidator(PageGroupList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PageGroupList.some(group => group.pageGroup.toLowerCase() === value);
        return match ? null : { pageGroupInvalid: true };
      };
    }

  submit() 
  {
    // emppty stuff
  }

  onNoClick(): void 
  {
    this.dialogRef.close();
  }

  public Post(): void
  {
    
    this.advanceTableForm.patchValue
                                  ({
                                    "Icon" :"fab fa-envira",
                                    "class" : "",
                                    "groupTitle" : "false",
                                    "remark" : "NA"
                                  });
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('PageCreate:PageView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('PageAll:PageView:Failure');//To Send Updates  
    }
  )
  }

  public Put(): void
  {
    
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('PageUpdate:PageView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('PageAll:PageView:Failure');//To Send Updates    
    }
  )
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

}


