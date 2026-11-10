// @ts-nocheck
import { Component, OnInit, Input, Output, EventEmitter, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
@Component({
  standalone: false,
  selector: 'app-myupload',
  templateUrl: './myupload.component.html',
  styleUrls: ['./myupload.component.css']
})
export class MyUploadComponent implements OnInit {
  public progress: number;
  public message: string;
  public messageType: '' | 'success' | 'error' = '';
  private readonly sampleFileName = 'TollParking_2026-10-30.jpg';
  @Input() buttonText = 'Upload File';
  @Input() compact = false;
  @Input() accept = '';
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient, public _generalService:GeneralService) { }
  ngOnInit() {
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.message = '';
    this.messageType = '';
    this.progress = 0;
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(this._generalService.getBaseURL() + 'fileupload', formData, { reportProgress: true, observe: 'events'})
      .subscribe(
        event =>
        {
            if (event.type === HttpEventType.UploadProgress)
            {
              this.progress = Math.round(100 * event.loaded / event.total);
            }
            else if (event.type == HttpEventType.Response)
            {
              this.message = 'Upload successful.';
              this.messageType = 'success';
              this.onUploadFinished.emit(event.body);
            }
        },
        error =>
        {
          const reason = (error?.error?.message || 'File upload was blocked.').toString();
          this.message = reason + ' Sample file name: ' + this.sampleFileName;
          this.messageType = 'error';
        }
    );
  }
}

