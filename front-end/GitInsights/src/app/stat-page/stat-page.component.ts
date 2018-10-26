import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as Country from 'country-list';
import { log } from 'util';

@Component({
  selector: 'app-stat-page',
  templateUrl: './stat-page.component.html',
  styleUrls: ['./stat-page.component.css']
})



export class StatPageComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  context: CanvasRenderingContext2D;


  // test purpose ==> results = '{"profile_picture":"https://avatars1.githubusercontent.com/u/30982987?v=4","country":"Switzerland","issues":[{"label":"Opened","value":0},{"label":"Closed","value":0}],"favLanguages":{"Java":1203794,"Dockerfile":1050,"CSS":267635,"C++":797671,"C":33529,"CMake":1228,"JavaScript":538538,"PHP":83311,"Shell":8185,"HTML":3942,"TypeScript":31503,"PLpgSQL":1946,"QMake":7571,"Makefile":79446},"milestones":[{"date":"2017-08-13T16:51:57Z","label":"account creation"},{"date":"2017-09-23T15:39:32Z","label":"first repository"}],"repositories":[{"label":"Created","value":23},{"label":"Forked","value":10},{"label":"Stars","value":0}],"trivia":[{"label":"Lines coded","value":3648},{"label":"Commits","value":18}]}';
  tips = [];
  chart = [];
  issues = [];
  trivias = [];
  milestones = [];
  repositories = [];

  avatarStyle;

  countries = Country();
  flagClasses = [
    'flag-icon-background',
    'flag-icon-squared'
  ];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getData();
  }

  setData(res: GitData) {
          console.log(res); // récupérer les données suite au get et les utiliser :D

          // set the flag and the avatar
          this.avatarStyle = {
            'background-image' : 'url("' + res.profile_picture + '")',
          };
          this.flagClasses.push('flag-icon-' + this.countries.getCode(res.country).toLowerCase());

          // set the issues, trivia, and repositories (list of object { label, value })
          this.issues = res.issues;
          this.trivias = res.trivia;
          this.repositories = res.repositories;

          // milestones for the timeline composant
          this.milestones = res.milestones;

          // chart creation - creating a list containing a the language and the total line number
          const languages: Array<{label: string, value: number}> = [];

          let labels: string[] = Object.keys(res.favLanguages); // languages
          let datas: number[] = Object.values(res.favLanguages); // total lines

          for (let _i = 0; _i < labels.length; _i++) {
            languages.push({label: labels[_i], value: datas[_i]});
          }

          // reset the list to store the top 5
          labels = [];
          datas = [];
          languages.sort(compareLanguage).slice(0, 5).forEach(elem => { labels.push(elem.label); datas.push(elem.value); });

          // chart creation
          this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
          this.chart = new Chart(this.context, {
            type: 'horizontalBar',
            data : {
              labels : labels,
              datasets: [{
                data : datas,
                backgroundColor : [
                  'rgb(72, 66, 244)',
                  'rgba(54, 162, 235, 1)',
                  'rgb(36, 122, 118)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ]
              }]
            },
            options : {
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Lines coded'
                  }
                }]
              },
              responsive: true
            }
          });
  }

  getData(): void {
    const urlServer = 'https://tweb-project1-serveur.herokuapp.com/user';

    const getUrl = urlServer + '?access_token=' + sessionStorage.getItem('token');

    console.log(getUrl);

    this.http.get(getUrl).toPromise()
      .then(
        res => {
          // TODO : loading screen
          this.setData(res);
        }
      )
      .catch(err => {
        console.log(err);
      });
  }
}

function compareLanguage(a, b) {
  if (a.value < b.value) {
    return 1;
  }

  if (a.value > b.value) {
    return -1;
  }

  return 0;
}


class GitData {
  country: string;
  profile_picture: string;
  favLanguages: Object;
  issues: Array<{label: string, value: number}>;
  milestones: Array<{date: Date, label: string}>;
  repositories: Array<{label: string, value: number}>;
  trivia: Array<{label: string, value: number}>;
  tips: string[];
}
