import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-btn-login',
  templateUrl: './btn-login.component.html',
  styleUrls: ['./btn-login.component.css']
})
export class BtnLoginComponent implements OnInit {

  constructor(private http:HttpClient) {}

  ngOnInit() {
  }

  buttonClicked(): void {
    this.http.get('https://github.com/login/oauth/authorize');
  }
}
