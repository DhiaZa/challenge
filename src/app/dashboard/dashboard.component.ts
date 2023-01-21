import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { EventService } from '../_services/event.service';
import { Event } from '../_models/event.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  events!: Event[];

  constructor(        private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService) {}

  ngOnInit() {
      this.eventService.getAll()
          .pipe(first())
          .subscribe(events => this.events = events);
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
}