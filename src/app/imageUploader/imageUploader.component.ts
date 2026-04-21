// @ts-nocheck
import { Component, OnInit, Output, EventEmitter, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
@Component({
  standalone: false,
  selector: 'app-imageUploader',
  templateUrl: './imageUploader.component.html',
  styleUrls: ['./imageUploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient, public _generalService:GeneralService) { }
  ngOnInit() {
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.message="Uploaded..."
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

  debugger;
    this.http.post(this._generalService.getBaseURL() + 'fileupload' , formData, { reportProgress: true, observe: 'events'})
      .subscribe(
        event =>
        {
            if (event.type === HttpEventType.UploadProgress)
            {
              this.progress = Math.round(100 * event.loaded / event.total);
              if (this.progress == 100)
              this.message = "Upload Successful";
            }
            else if (event.type == HttpEventType.Response)
            {
              this.message = 'Upload success.';
              this.onUploadFinished.emit(event.body);
            }
        },

    );
  }
}

