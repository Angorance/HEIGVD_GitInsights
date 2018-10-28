import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})

export class TimelineComponent implements OnInit {

  // User's milestones from the parent components
  @Input() milestones: Array<{date: string, label: String}>;

  // in order to display the next big milestones (Happy New Years :D)
  today = new Date();

  years = [];

  constructor() {
   }

   /**
    * get the position of a date bewteen two borns
    * @param sDate 
    */
   getPercentagePosition(sDate: string) {

     const date: Date =  new Date(sDate);
     const start = new Date(new Date(this.milestones[0].date).getFullYear(), 1, 1);
     const end = new Date(this.today.getFullYear() + 1, 1, 1);
     const position = (date.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100;

     return position;
   }

   /**
    * Set the position style from a milstones date
    * @param date 
    */
   setMilestoneStyle(date: string) {
     return {
       'left' : this.getPercentagePosition(date).toString() + '%',
     };
   }

   /**
    * make the tooltip for a certain milestone
    * @param elem Milestone use to make the tooltip
    */
   getTooltip(elem: {date: string, label: string} ) {
     return new Date(elem.date).toLocaleDateString() + ' - ' + elem.label.charAt(0).toUpperCase() + elem.label.slice(1);
   }

   /**
    * fills the years array, in order to have the big dots in the timeline 
    * (from the 01.01.XX - XX being the account creation years - to the 
    * 01.01.YY - YY being the current next year )
    */
   fillYears() {
    this.years = [];

      for (let i = new Date(this.milestones[0].date).getFullYear() ; i <= this.today.getFullYear() + 1; ++i) {
        this.years.push(i);
      }
   }

  ngOnInit() {
  }

  /**
   * This function is called whenever a modification in the state of the component occures
   * @param changes Object containing the changes between two states of the component (befor/after)
   */
  ngOnChanges(changes: SimpleChanges): void {
    // first step : sort the dates in order to have the oldest date first
    if (this.milestones.length > 0) {
      this.milestones = this.milestones.sort(compareDates);
      this.fillYears();
    }
  }
}

function compareDates(a: {date: string, label: string}, b: {date: string, label: string}) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
