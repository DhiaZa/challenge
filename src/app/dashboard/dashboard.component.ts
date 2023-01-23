import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { EventService } from '../_services/event.service';
import { Event } from '../_models/event.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 
  events!: Event[];
  festivalpercent:any;
  sportpercent:any;
  conferencepercent:any;
  concertpercent:any;

  constructor(        private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService) {}

  ngOnInit() {
 
this.filterCategory()
  }

  deleteEvent(id: string) {
      const event = this.events.find(x => x.id === id);
      if (!event) return;
      event.isDeleting = true;
      this.eventService.delete(id)
          .pipe(first())
          .subscribe(() => this.events = this.events.filter(x => x.id !== id));
  }
  navigateToAdd(){
    this.router.navigate(['/add-event']);
  }
filterCategory(){
  this.eventService.getAll().subscribe((events) =>{ this.events = events; 
    let festival = this.events.filter((obj) =>obj.category === "Festivals");
    let sport = this.events.filter((obj) =>obj.category === "Sports");
    let conference = this.events.filter((obj) =>obj.category === "Conferances");
    let concert = this.events.filter((obj) =>obj.category === "Concerets");
    this.festivalpercent = Math.floor(festival.length / this.events.length * 100);
    this.sportpercent = Math.floor(sport.length / this.events.length * 100);
    this.conferencepercent = Math.floor(conference.length / this.events.length * 100);
    this.concertpercent = Math.floor(concert.length / this.events.length * 100);


  });
}
filterByDate(element){
   let elem =   element.target.value;
  let currentDate = new Date();
  var todayDate = new Date().toISOString().slice(0, 10);
  var dateObject = new Date(todayDate);
  let weekPlus = dateObject.setDate( dateObject.getDate() + 7 );
  let monthPlus = dateObject.setDate( dateObject.getDate() + 30 );
  let week = new Date(weekPlus)
  let month = new Date(monthPlus)


switch(elem) { 
  case 'week': { 
    this.eventService.getAll().subscribe((events) =>{
    this.events = events.filter((item: any) => {
      let days = new Date(item.day)
      return days.getTime() >= currentDate.getTime() &&
             days.getTime() <= week.getTime();
  });
  let festival = this.events.filter((obj) =>obj.category === "Festivals");
    let sport = this.events.filter((obj) =>obj.category === "Sports");
    let conference = this.events.filter((obj) =>obj.category === "Conferances");
    let concert = this.events.filter((obj) =>obj.category === "Concerets");
    this.festivalpercent = Math.floor(festival.length / this.events.length * 100);
    this.sportpercent = Math.floor(sport.length / this.events.length * 100);
    this.conferencepercent = Math.floor(conference.length / this.events.length * 100);
    this.concertpercent = Math.floor(concert.length / this.events.length * 100);
});
     break; 
  } 
  case 'month': { 
    this.eventService.getAll().subscribe((events) =>{
    this.events= events.filter((item: any) => {
      let days = new Date(item.day)
      return days.getTime() >= currentDate.getTime() &&
             days.getTime() <= month.getTime();
    }); 
    let festival = this.events.filter((obj) =>obj.category === "Festivals");
    let sport = this.events.filter((obj) =>obj.category === "Sports");
    let conference = this.events.filter((obj) =>obj.category === "Conferances");
    let concert = this.events.filter((obj) =>obj.category === "Concerets");
    this.festivalpercent = Math.floor(festival.length / this.events.length * 100);
    this.sportpercent = Math.floor(sport.length / this.events.length * 100);
    this.conferencepercent = Math.floor(conference.length / this.events.length * 100);
    this.concertpercent = Math.floor(concert.length / this.events.length * 100);
  });
     break; 
  } 
  case 'all': { 
this.filterCategory() 
  } 
} 
}

}