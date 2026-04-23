// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RolePageMappingService } from '../../rolePageMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { RolePageMapping } from '../../rolePageMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/general/general.service';
import { PageDropDown } from 'src/app/general/pageDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PageGroupDropDown } from 'src/app/pageGroup/pageGroupDropDown.model';
import { PageService } from 'src/app/page/page.service';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  RoleID:number;
  Role: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: RolePageMapping;
  //public PageList?: PageDropDown[] = [];
  public PageList?: PageDropDown[] = [];
  filteredPageOptions: Observable<PageDropDown[]>;
  pageID: any;
  existPageMessage: boolean = false;
  isSaveDisabled: boolean = false;
  filteredPageGroupOptions: Observable<PageGroupDropDown[]>;
  public PageGroupList?: PageGroupDropDown[] = [];
    pageGroupID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: RolePageMappingService,
  public pageService: PageService,
  private fb: FormBuilder,
  public _generalService:GeneralService) 
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Role Page Mapping';       
          this.advanceTable = data.advanceTable;
          this.InitPagesEdit();
        } else 
        {
          this.dialogTitle = 'Role Page Mapping';
          this.advanceTable = new RolePageMapping({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.roleID = data?.advanceTable?.roleID;
          this.advanceTable.role = data?.advanceTable?.role;
        }        
        this.advanceTableForm = this.createContactForm();
        this.RoleID=data.RoleID;
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

  public ngOnInit(): void
  {
    this.InitPageGroup();
    //this.InitPages();
    if(this.action==='edit')
    {
      this.InitPageGroup();
      this.InitPagesEdit();
    }
  }

  
      InitPageGroup() {
        this.pageService.GetPageGroup().subscribe(
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
        this.InitPages();
      }
    
      PageValidator(PageGroupList: any[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value?.toLowerCase();
          const match = PageGroupList.some(group => group.pageGroup.toLowerCase() === value);
          return match ? null : { pageGroupInvalid: true };
        };
      }
  
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      rolePageMappingID: [this.advanceTable.rolePageMappingID],
      roleID: [this.advanceTable.roleID],
      role: [this.advanceTable.role],
      pageID: [this.advanceTable.pageID],
      page: [this.advanceTable.page],
      activationStatus: [this.advanceTable.activationStatus],
      pageGroup:[this.advanceTable.pageGroup],
      pageGroupID:[this.advanceTable.pageGroupID]
      
    });
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
    this.advanceTableForm.patchValue({roleID:this.advanceTable.roleID,
                                      role:this.advanceTable.role});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('RolePageMappingCreate:RolePageMappingView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('RolePageMappingAll:RolePageMappingView:Failure');//To Send Updates     
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({roleID:this.advanceTable.roleID,
      role:this.advanceTable.role});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  

    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('RolePageMappingUpdate:RolePageMappingView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('RolePageMappingAll:RolePageMappingView:Failure');//To Send Updates  
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

  InitPages(){
    this._generalService.GetRoleForPageGroup(this.RoleID,this.pageGroupID ).subscribe
    (
      data =>   
      {
        if(data)
        {
          this.PageList = data;
          this.existPageMessage=false;
        }
        else
        {
          this.existPageMessage=true;
          this.advanceTableForm.controls['pageID'].disable();
          this.isSaveDisabled=true;
        }
      }
    );
  }

  InitPagesEdit()
  {
    this._generalService.GetRoleForPageGroup(this.RoleID,this.advanceTable.pageGroupID).subscribe(
    data=>
    {
      if(data)
      {
        this.PageList = data;
        this.filteredPageOptions =this.advanceTableForm.controls['page'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        );
      }
      else
      {
        this.existPageMessage=true;
         this.advanceTableForm.controls['modeOfPayment'].disable();
      }  
    });
  }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    return this.PageList.filter(
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
  }



