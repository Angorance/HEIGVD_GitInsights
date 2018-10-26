import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Country } from 'country-list';

@Component({
  selector: 'app-stat-page',
  templateUrl: './stat-page.component.html',
  styleUrls: ['./stat-page.component.css']
})

export class StatPageComponent implements OnInit {

  tips = ['a random tip',
    'another tip',
    'oh my, so much tip just for me',
    'this one isn\'t very relevant ',
    'this is the last one, promised',
    'ahah just kidding, this is the last :)'
  ];

  chart = [];

  countries = require('country-list')();
  flagClasses = [
    'flag-icon-background',
    'flag-icon-squared'
  ];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    console.log();
    this.flagClasses.push('flag-icon-' + this.countries.getCode('Iceland').toLowerCase());
  }

  getData(): void {
    const urlServer = 'https://tweb-project1-serveur.herokuapp.com/user';

    const getUrl = urlServer + '?access_token=' + sessionStorage.getItem('token');

    console.log(getUrl);

    this.http.get(getUrl).toPromise()
      .then(
        res => {
          console.log(res); // récupérer les données suite au get et les utiliser :D
        }
      )
      .catch(err => {
        console.log(err);
      });
  }
}
