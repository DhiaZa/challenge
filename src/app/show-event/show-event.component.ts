import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import { MustMatch } from '../_helpers/must-match.validator';
import { EventService } from '../_services/event.service';
@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.scss']
})
export class ShowEventComponent implements OnInit {

  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  imageEvent:any;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private eventService: EventService,
      private alertService: AlertService
  ) {}

  ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.isAddMode = !this.id;
      
      // password not required in edit mode
      const passwordValidators = [Validators.minLength(6)];
  

      this.form = this.formBuilder.group({
        category: ['', Validators.required],
          title: ['', Validators.required],
          description: ['', Validators.required],
          image: ['', Validators.required],
          file: [''],
          location: ['', Validators.required],
          day: ['', Validators.required],
          start: ['', Validators.required],
      });

      if (!this.isAddMode) {
          this.eventService.getById(this.id).subscribe((x) => {this.form.patchValue(x)
            this.imageEvent=x.image
          }
            );
              
      }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }


}