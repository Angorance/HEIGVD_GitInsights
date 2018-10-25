import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'app-callback-page',
  templateUrl: './callback-page.component.html',
  styleUrls: ['./callback-page.component.css']
})
export class CallbackPageComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.getToken();
  }

  ngOnInit() { }

  getToken(): void {
    const urlServer: string = 'https://tweb-project1-serveur.herokuapp.com/authenticate';

    let url: URLSearchParams = new URLSearchParams(window.location.href.split('?')[1]);

    let getUrl = urlServer + '?code=' + url.get('code');

    console.log(getUrl);

    this.http.get(getUrl).toPromise()
      .then(
        res => { // Success
          console.log(res);
        }
      )
  }
}
