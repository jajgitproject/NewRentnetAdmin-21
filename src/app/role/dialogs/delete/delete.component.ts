// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { RoleService } from '../../role.service';
import { GeneralService } from 'src/app/general/general.service';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent implements OnInit, AfterViewInit
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: RoleService,
    public _generalService: GeneralService,
    private hostEl: ElementRef<HTMLElement>
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  ngOnInit(): void
  {
    const pane = document.querySelector('.cdk-overlay-pane:last-child') as HTMLElement | null;
    // #region agent log
    fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H3',location:'role/delete.component.ts:ngOnInit',message:'Role delete dialog component initialized',data:{selector:'app-delete',title:'Deleting Role',role:this.data?.role || null,paneClassName:pane?.className || null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }
  ngAfterViewInit(): void
  {
    const host = this.hostEl.nativeElement;
    const container = host.querySelector('.container') as HTMLElement | null;
    const title = host.querySelector('h2[mat-dialog-title]') as HTMLElement | null;
    const subtitle = host.querySelector('h3[mat-dialog-title]') as HTMLElement | null;
    const actions = host.querySelector('[mat-dialog-actions]') as HTMLElement | null;
    const pane = document.querySelector('.cdk-overlay-pane:last-child') as HTMLElement | null;
    // #region agent log
    fetch('http://127.0.0.1:7278/ingest/38c94268-8542-449e-a503-35f5e1042ec5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd6e32'},body:JSON.stringify({sessionId:'cd6e32',runId:'pre-fix',hypothesisId:'H4',location:'role/delete.component.ts:ngAfterViewInit',message:'Computed dialog width and alignment',data:{paneWidth:pane?.getBoundingClientRect().width || null,containerTextAlign:container ? getComputedStyle(container).textAlign : null,titleTextAlign:title ? getComputedStyle(title).textAlign : null,subtitleTextAlign:subtitle ? getComputedStyle(subtitle).textAlign : null,actionsJustify:actions ? getComputedStyle(actions).justifyContent : null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.roleID)  
    .subscribe(
    data => 
    {
      this._generalService.sendUpdate('RoleDelete:RoleView:Success');//To Send Updates 
    },
    error =>
    {
      this._generalService.sendUpdate('RoleAll:RoleView:Failure');//To Send Updates    
    }
    )
  }
}


