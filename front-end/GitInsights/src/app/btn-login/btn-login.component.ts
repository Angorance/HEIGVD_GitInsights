import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-btn-login',
  templateUrl: './btn-login.component.html',
  styleUrls: ['./btn-login.component.css']
})
export class BtnLoginComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  buttonClicked(): void {

    console.log('Redirecting to GitHub');

    // TODO - Put URL (or at least client_id) somewhere else
    let redirect: string = 'https://github.com/login/oauth/authorize?client_id=2a9a479e2953860bbd89&scope=repo:status%20read:user';

    window.location.href = redirect;
  }
}
