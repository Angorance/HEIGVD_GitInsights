import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn-login',
  templateUrl: './btn-login.component.html',
  styleUrls: ['./btn-login.component.css']
})
export class BtnLoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  buttonClicked(): void {
    console.log("On va SE CONNECTER POTO ");
  }
}
