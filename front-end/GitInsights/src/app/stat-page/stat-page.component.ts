import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stat-page',
  templateUrl: './stat-page.component.html',
  styleUrls: ['./stat-page.component.css']
})
export class StatPageComponent implements OnInit {

  tips = ['a random tip',
    'another tip',
    'oh my, so much tip just for me',
    'this one isn\'t very relevant (it was Daniel\'s idea ;) )',
    'this is the last one, promised',
    'ahah just kidding, this is the last :)'
  ];

  chart = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    const urlServer: string = 'https://tweb-project1-serveur.herokuapp.com/user';

    let getUrl = urlServer + '?access_token=' + sessionStorage.getItem('token');

    console.log(getUrl);

    this.http.get(getUrl).toPromise()
      .then(
        res => {
          console.log(res);
        }
      )
      .catch(err => {
        console.log(err);
      });
  }
}
