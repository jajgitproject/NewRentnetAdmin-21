// @ts-nocheck
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import {
  UPLOAD_ACCEPT,
  UPLOAD_ALLOWED_HINT,
  isAllowedUploadFileName,
} from '../general/upload-allowed';

@Component({
  standalone: false,
  selector: 'app-imageUploader',
  templateUrl: './imageUploader.component.html',
  styleUrls: ['./imageUploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  public progress: number;
  public message: string;
  public messageType: '' | 'success' | 'error' = '';
  public readonly accept = UPLOAD_ACCEPT;
  public readonly allowedHint = UPLOAD_ALLOWED_HINT;
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient, public _generalService: GeneralService) { }
  ngOnInit() {
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.message = '';
    this.messageType = '';
    let fileToUpload = <File>files[0];

    if (!isAllowedUploadFileName(fileToUpload.name)) {
      this.message = UPLOAD_ALLOWED_HINT;
      this.messageType = 'error';
      return;
    }

    this.message = 'Uploaded...';
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(this._generalService.getBaseURL() + 'fileupload', formData, { reportProgress: true, observe: 'events'})
      .subscribe(
        event =>
        {
            if (event.type === HttpEventType.UploadProgress)
            {
              this.progress = Math.round(100 * event.loaded / event.total);
              if (this.progress == 100)
              this.message = 'Upload Successful';
              this.messageType = 'success';
            }
            else if (event.type == HttpEventType.Response)
            {
              this.message = 'Upload success.';
              this.messageType = 'success';
              this.onUploadFinished.emit(event.body);
            }
        },
        error =>
        {
          const reason = (error?.error?.message || 'File upload was blocked.').toString();
          this.message = reason + ' ' + UPLOAD_ALLOWED_HINT;
          this.messageType = 'error';
        }
    );
  }
}
