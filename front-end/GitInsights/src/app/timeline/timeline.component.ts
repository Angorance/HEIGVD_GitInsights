import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit {

  startDate = new Date(2014,9,15);
  endDate = new Date();

  //For the purpose of stringifying MM/DD/YYYY date format
  monthSpan = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years = [];
  milestones = [this.startDate, new Date(2015, 5, 25), new Date(2017, 12, 12), new Date()];

  constructor() {
    //console.log("start year : " + this.startDate.getFullYear());
    //console.log("start year : " + this.endDate.getFullYear());

    for( let i = this.startDate.getFullYear() ; i <= this.endDate.getFullYear()+1; ++i){
      this.years.push(i);
    }

    //console.log(this.years);
   }

   getPercentagePosition(date : Date){
     var start = new Date(this.startDate.getFullYear(), 1,1);
     var end = new Date(this.endDate.getFullYear()+1, 1,1);
     var position = (date.valueOf() - start.valueOf())/(end.valueOf()- start.valueOf()) * 100;
     console.log("position : " + position + "%");

     return position;
   }


   setMilestoneStyle(date : Date){
     console.log("generating" + " position for "+ date.toDateString());
     let style = {
       'left' : this.getPercentagePosition(date).toString()+"%",
     };

     console.log("result style : " + style);
     return style;
   }

  ngOnInit() {
  }
}