import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-callback-page',
  templateUrl: './callback-page.component.html',
  styleUrls: ['./callback-page.component.css']
})
export class CallbackPageComponent implements OnInit {

  constructor(private http: HttpClient, private storage: WebStorageService) {
    this.getToken();
  }

  ngOnInit() { }

  getToken(): void {
    const urlServer: string = 'https://tweb-project1-serveur.herokuapp.com/authenticate';

    let url: URLSearchParams = new URLSearchParams(window.location.href.split('?')[1]);

    let getUrl = urlServer + '?code=' + url.get('code');

    console.log(getUrl);

    this.http.get(getUrl)
      .subscribe((data: string) => {
        console.log(data);

        this.storage.set('access_token', data['access_token'])
      });

    console.log(this.storage.get('access_token'));
  }
}
