import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn-login',
  templateUrl: './btn-login.component.html',
  styleUrls: ['./btn-login.component.css']
})
export class BtnLoginComponent implements OnInit {

  constructor() { }

  // application client id
  clientId = '2f294cfc663fdb3625c6';

  ngOnInit() { }

  /**
   * redirect the user to the gitHub OAuth page
   */
  buttonClicked(): void {
    let redirect: string = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId + '&scope=repo%20user';
    window.location.href = redirect;
  }
}
