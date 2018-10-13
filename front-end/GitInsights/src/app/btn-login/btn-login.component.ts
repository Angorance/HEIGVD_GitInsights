import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-btn-login',
  templateUrl: './btn-login.component.html',
  styleUrls: ['./btn-login.component.css']
})
export class BtnLoginComponent implements OnInit {

  constructor(private http:HttpClient) {}

  ngOnInit() {}

  buttonClicked(): void {

    console.log('Button clicked!');

    const params = {
      params: new HttpParams().set('client_id', '2a9a479e2953860bbd89')
    }

    let test = this.http.get(
      'https://github.com/login/oauth/authorize',
      params
    ).subscribe();

    console.log(test);
  }
}
