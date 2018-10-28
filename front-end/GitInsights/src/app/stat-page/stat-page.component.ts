import { ErrorDialogComponent } from './../error-dialog/error-dialog.component';
import {
  Component, OnInit, ViewChild, ElementRef,
  Inject, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as Country from 'country-list';
import { trigger, state, style,
  animate, transition } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-stat-page',
  templateUrl: './stat-page.component.html',
  styleUrls: ['./stat-page.component.css'],
  animations: [ // animation for the loading screen
    trigger('endLoad', [
      state(
        'opened',
        style({
          height: '100%',
          opacity: 1
        })
      ),
      state(
        'closed',
        style({
          height: '0%',
          opacity: 0 // we set the opacity to 0, otherwise the spinner would still be visible
        })
      ),
      transition('opened => closed', [animate('0.5s ease-in-out')])
    ])
  ]
})

export class StatPageComponent implements OnInit {
  @ViewChild('canvas')
  canvas: ElementRef;
  context: CanvasRenderingContext2D;

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

  // define if the application has gathered all the data needed (loading screen)
  loaded = false;

  // style for the avatar div, to display the picture in background
  avatarStyle;

  // object for the country-list package (npm)
  countries = Country();

  // classes for the flag icon
  flagClasses = ['flag-icon-background', 'flag-icon-squared'];

  // server URL used
  _srvAddress = 'https://tweb-project1-serveur.herokuapp.com';

  // dialog box in case of error
  errorDialogRef: MatDialogRef<ErrorDialogComponent>;

  constructor(private http: HttpClient, public dialog: MatDialog) {}
  ngOnInit() {

    // we have to retrieve the token to make request to the server
    this.getToken();
  }

  /**
   * Use the code given by GitHub OAuth service to ask the server to retrieve 
   * the user token. If a token is already available, we simply bypass this step
   * When we have a token we ask the server to gather the user informations
   */
  getToken() : void {

    // check token presence
    if (sessionStorage.getItem('token') === null) {
      // no token found, we have to get it

      const srvTokenService = '/authenticate';
      const callbackCode: URLSearchParams = new URLSearchParams(window.location.href.split('?')[1]);
      const getUrl = this._srvAddress + srvTokenService + '?code=' + callbackCode.get('code');

      // send the request to the server
      this.http.get(getUrl).toPromise()
      .then(
        res => {
          // token successfully retreived, we store it for the session
          sessionStorage.setItem('token', res['access_token']);
          this.getData();
        }
      )
      .catch(err => {
        // mistakes were mades :(
        this.openDialogue();
      });
    } else {
      
      this.getData();
    }
  }

  /**
   * Ask the server to retreive the user data and use them.
   * One the datas are retrieved and the UI is ready, trigger the
   * loading screen removal
   */
  getData(): void {
    // we have to give the user token to the server
    const srvService = '/user';
    const getUrl = this._srvAddress + srvService + '?access_token=' + sessionStorage.getItem('token');

    // make the request and wait for the response
    this.http
      .get(getUrl)
      .toPromise()
      .then((res: GitData) => {
        // we have our datas
        this.setData(res);
        this.loaded = true;
      })
      .catch(err => {

        // mistakes were made :(
        this.openDialogue();
      });
  }

  /**
   * Use and display the differents user data provided by the server and the GitHun API
   * @param res Object representing the user data to use for the stats and the tips
   */
  setData(res: GitData) {

    // set the avatar and the flag
    this.avatarStyle = {
      'background-image': 'url("' + res.profile_picture + '")'
    };

    if (res.country) {
      // not everyone has set their country...
      this.flagClasses.push(
        'flag-icon-' + this.countries.getCode(res.country).toLowerCase()
      );
    }

    // set the issues, trivia, repositories and tips
    this.issues = res.issues;
    this.trivias = res.trivia;
    this.repositories = res.repositories;
    this.tips = res.tips;

    // milestones for the timeline composant
    if (res.milestones) {
      this.milestones = res.milestones;
    }

    // chart creation - we have to create an array containing all the language and the total line number
    if (res.favLanguages) {

      let labels: string[] = Object.keys(res.favLanguages); // languages
      let datas: number[] = Object.values(res.favLanguages); // total lines

      for (let _i = 0; _i < labels.length; _i++) {
        this.languages.push({ label: labels[_i], value: datas[_i] });
      }

      // reset the list to store the top languages used
      labels = [];
      datas = [];
      this.languages
        .sort(compareLanguage)
        .slice(0, 7) // we only keep the top 7
        .forEach(elem => {
          labels.push(elem.label);
          datas.push(elem.value);
        });

      // chart creation
      this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
      this.chart = new Chart(this.context, {
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [
            {
              data: datas,
              backgroundColor: [
                'rgb(72, 66, 244)',
                'rgba(54, 162, 235, 1)',
                'rgb(36, 122, 118)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgb(72, 66, 244)',
                'rgba(54, 162, 235, 1)',
                'rgb(36, 122, 118)',
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
                  labelString: 'Coded lines'
                }
              }
            ]
          },
          responsive: true
        }
      });
    }
  }

  /**
   * Set a specific font color considering the "score" of the user
   * 
   * @param quality position in the quality tab to use
   */
  getTipStyle(quality: number) {
    return {
      'color' : this.qualityTab[quality % this.qualityTab.length],
    };
  }

  /**
   * Open a dialog box. When the dialog is closed, we clear the token storage, and 
   * redirect the user to the home page
   */
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

/**
 * Compare two languages
 * @param a first language to compare
 * @param b second language to compare
 */
function compareLanguage(a: {label:string, value:number}, b: {label:string, value:number}) {
  if (a.value < b.value) {
    return 1;
  }

  if (a.value > b.value) {
    return -1;
  }

  return 0;
}

/**
 * class representing the datas gathered by the server
 */
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

/**
 * represent a tip
 */
class Tip {
  title: string; // category for the tip
  score:  number; 
  criteria: string; // how did we judge the user
  quality: number; // how well did he do
  tip: string;
}
