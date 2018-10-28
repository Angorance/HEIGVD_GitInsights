import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

  ressource: {text: string} ;

  constructor(@Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.ressource = this.data;
  }

}
