// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-PassengerPlacard',
  templateUrl: './PassengerPlacard.component.html',
  styleUrls: ['./PassengerPlacard.component.scss']
})
export class PassengerPlacardComponent {
  dialogTitle = 'Passenger Placard';
  passengerName: string;

  constructor(
    public dialogRef: MatDialogRef<PassengerPlacardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { passengerName: string }
  ) {
    this.passengerName = data?.passengerName || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  printPlacard(): void {
    const name = (this.passengerName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const printWindow = window.open('', '_blank', 'width=1123,height=794');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Passenger Placard - ${name}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
    }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .placard-page {
      width: 297mm;
      height: 210mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7f4ef;
      padding: 18mm;
    }
    .placard-frame {
      width: 100%;
      height: 100%;
      border: 3px solid #1a3a4a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #fff;
      padding: 20mm;
      position: relative;
    }
    .placard-frame::before {
      content: '';
      position: absolute;
      inset: 8mm;
      border: 1px solid #c5b8a5;
      pointer-events: none;
    }
    .welcome-label {
      font-size: 42pt;
      font-weight: 400;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #1a3a4a;
      margin-bottom: 18mm;
    }
    .passenger-name {
      font-size: 56pt;
      font-weight: 700;
      color: #0f2a36;
      line-height: 1.2;
      max-width: 100%;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="placard-page">
    <div class="placard-frame">
      <div class="welcome-label">Welcome</div>
      <div class="passenger-name">${name}</div>
    </div>
  </div>
  <script>
    window.onload = function () {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>`);
    printWindow.document.close();
  }
}
