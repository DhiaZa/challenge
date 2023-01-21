import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';
import { MustMatch } from '../_helpers/must-match.validator';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  loading = false;
  submitted = false;

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
      if (this.isAddMode) {
          passwordValidators.push(Validators.required);
      }

      const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
      this.form = this.formBuilder.group({
          title: ['', Validators.required],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
          confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
      }, formOptions);

      if (!this.isAddMode) {
          this.eventService.getById(this.id)
              .pipe(first())
              .subscribe(x => this.form.patchValue(x));
      }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
  
          this.createEvent();
     
  }

  private createEvent() {
      this.eventService.create(this.form.value)
          .pipe(first())
          .subscribe(() => {
              this.alertService.success('event added', { keepAfterRouteChange: true });
              this.router.navigate(['../dashboard'], { relativeTo: this.route });
          })
          .add(() => this.loading = false);
  }


}