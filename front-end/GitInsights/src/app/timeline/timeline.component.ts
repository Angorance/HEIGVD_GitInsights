import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})

export class TimelineComponent implements OnInit {

  @Input() milestones: Array<{date: string, label: String}>;

  today = new Date();

  years = [];

  constructor() {
   }

   getPercentagePosition(sDate: string) {

     const date: Date =  new Date(sDate);
     const start = new Date(new Date(this.milestones[0].date).getFullYear(), 1, 1);
     const end = new Date(this.today.getFullYear() + 1, 1, 1);
     const position = (date.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100;

     return position;
   }


   setMilestoneStyle(date: string) {
     return {
       'left' : this.getPercentagePosition(date).toString() + '%',
     };
   }

   getTooltip(elem: {date: string, label: string} ) {
     return new Date(elem.date).toLocaleDateString() + ' - ' + elem.label.charAt(0).toUpperCase() + elem.label.slice(1);
   }

   fillYears() {
    this.years = [];

      for (let i = new Date(this.milestones[0].date).getFullYear() ; i <= this.today.getFullYear() + 1; ++i) {
        this.years.push(i);
      }
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // first step : sort the dates in order to have the oldest date first
    if (this.milestones.length > 0) {
      this.milestones = this.milestones.sort(compareDates);
      this.fillYears();
    }
  }
}

function compareDates(a, b) {
  return -1; // new Date(b.date) - new Date(a.date);
}
