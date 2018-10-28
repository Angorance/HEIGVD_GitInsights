import { ErrorDialogComponent } from './../error-dialog/error-dialog.component';
import {
  Component, OnInit, ViewChild, ElementRef,
  Inject, HostBinding } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";
import * as Country from "country-list";
import { trigger, state, style,
  animate, transition } from "@angular/animations";
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: "app-stat-page",
  templateUrl: "./stat-page.component.html",
  styleUrls: ["./stat-page.component.css"],
  animations: [
    trigger("endLoad", [
      state(
        "opened",
        style({
          height: "100%",
          opacity: 1
        })
      ),
      state(
        "closed",
        style({
          height: "0%",
          opacity: 0
        })
      ),
      transition("opened => closed", [animate("0.5s ease-in-out")])
    ])
  ]
})

export class StatPageComponent implements OnInit {
  @ViewChild("canvas")
  canvas: ElementRef;
  context: CanvasRenderingContext2D;

  // test purpose ==>
  results = '{"country":"Switzerland","profile_picture":"https://avatars1.githubusercontent.com/u/30982987?v=4","favLanguages":{"Java":1203794,"Dockerfile":1050,"CSS":267635,"C++":797671,"C":33529,"CMake":1228,"JavaScript":538538,"PHP":83311,"Shell":8185,"HTML":3942,"TypeScript":31503,"PLpgSQL":1946,"QMake":7571,"Makefile":79446},"repositories":[{"label":"Created","value":23},{"label":"Forked","value":10},{"label":"Stars","value":3}],"issues":[{"label":"Opened","value":0},{"label":"Closed","value":31}],"milestones":[{"date":"2017-08-13T16:51:57Z","label":"account creation"},{"date":"2017-09-23T15:39:32Z","label":"first repository"},{"date":"2017-09-23T15:38:49Z","label":"first commit"}],"trivia":[{"label":"Coded lines","value":905019},{"label":"Commits","value":200}],"tips":[]}';
  tips: Array<Tip> = [];
  chart = [];
  issues: Array<{label: string, value: number}> = [];
  trivias: Array<{label: string, value: number}> = [];
  milestones: Array<{ date: string; label: string }> = [];
  repositories: Array<{label: string, value: number}> = [];
  languages: Array<{ label: string; value: number }> = [];

  qualityTab = [
    '#32D157',
    '#D69704',
    '#C90000'
  ];

  // define if the application has gathered all the data needed
  loaded = false;

  // style for the avatar div, to display the picture in background
  avatarStyle;

  // object for the country-list package (npm)
  countries = Country();
  // classes for the flag icon
  flagClasses = ["flag-icon-background", "flag-icon-squared"];

  _srvAddress = 'https://tweb-project1-serveur.herokuapp.com'; // "http://localhost:3000";

  errorDialogRef: MatDialogRef<ErrorDialogComponent>;

  constructor(private http: HttpClient, public dialog: MatDialog) {}
  ngOnInit() {
    /*this.setData(JSON.parse(this.results));
    this.loaded = true;*/
    //this.getData();
    this.getToken();
  }

  getToken() : void {
    if (sessionStorage.getItem('token') === null) {
      // no token found, we have to get it
      const srvTokenService = '/authenticate';

      // we came from github so we have to get the code returned
      const callbackCode: URLSearchParams = new URLSearchParams(window.location.href.split('?')[1]);

      // url to send the request to
      const getUrl = this._srvAddress + srvTokenService + '?code=' + callbackCode.get('code');

      // send the request to the server
      this.http.get(getUrl).toPromise()
      .then(
        res => {
          sessionStorage.setItem('token', res['access_token']);
          this.getData();
        }
      )
      .catch(err => {
        this.openDialogue();
      });
    } else {
      
      this.getData();
    }
  }

  setData(res: GitData) {

    // set the flag and the avatar
    this.avatarStyle = {
      "background-image": 'url("' + res.profile_picture + '")'
    };
    if (res.country) {
      this.flagClasses.push(
        "flag-icon-" + this.countries.getCode(res.country).toLowerCase()
      );
    }

    // set the issues, trivia, and repositories (list of object { label, value })
    this.issues = res.issues;
    this.trivias = res.trivia;
    this.repositories = res.repositories;
    this.tips = res.tips;

    // milestones for the timeline composant
    if (res.milestones) {
      this.milestones = res.milestones;
    }

    // chart creation - creating a list containing a the language and the total line number
    if (res.favLanguages) {

      let labels: string[] = Object.keys(res.favLanguages); // languages
      let datas: number[] = Object.values(res.favLanguages); // total lines

      for (let _i = 0; _i < labels.length; _i++) {
        this.languages.push({ label: labels[_i], value: datas[_i] });
      }

      // reset the list to store the top 5
      labels = [];
      datas = [];
      this.languages
        .sort(compareLanguage)
        .slice(0, 7)
        .forEach(elem => {
          labels.push(elem.label);
          datas.push(elem.value);
        });

      // chart creation
      this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext(
        "2d"
      );
      this.chart = new Chart(this.context, {
        type: "horizontalBar",
        data: {
          labels: labels,
          datasets: [
            {
              data: datas,
              backgroundColor: [
                "rgb(72, 66, 244)",
                "rgba(54, 162, 235, 1)",
                "rgb(36, 122, 118)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgb(72, 66, 244)",
                "rgba(54, 162, 235, 1)",
                "rgb(36, 122, 118)",
              ]
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Coded lines"
                }
              }
            ]
          },
          responsive: true
        }
      });
    }
  }

  getData(): void {
    const srvService = "/user"; // 'https://tweb-project1-serveur.herokuapp.com/user';

    const getUrl = this._srvAddress +
    srvService + "?access_token=" + sessionStorage.getItem("token");

    this.http
      .get(getUrl)
      .toPromise()
      .then((res: GitData) => {

        this.setData(res);
        this.loaded = true;
      })
      .catch(err => {
        this.openDialogue();
      });
  }

  getTipStyle(i: number) {

    return {
      'color' : this.qualityTab[i % this.qualityTab.length],
    };
  }

  openDialogue(): void {
    this.errorDialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '60%',
      autoFocus : false,
    });

    this.errorDialogRef.afterClosed().subscribe(() => {
      sessionStorage.removeItem('token');
      window.location.href = '/home';
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
  issues: Array<{ label: string, value: number }>;
  milestones: Array<{ date: string, label: string }>;
  repositories: Array<{ label: string, value: number }>;
  trivia: Array<{ label: string, value: number }>;
  tips: Array<Tip>;
}

class Tip {
  title: string;
  score:  number;
  criteria: string;
  quality: number;
  tip: string;
}
