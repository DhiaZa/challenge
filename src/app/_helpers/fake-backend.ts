import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../_models/user.model';
const eventsKey = 'events';
const eventsJSON = localStorage.getItem(eventsKey);
let events: any[] = eventsJSON
  ? JSON.parse(eventsJSON)
  : [
    ];
const users: User[] = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(delay(500))
        .pipe(dematerialize());

    function handleRoute() {
        switch (true) {
            case url.endsWith('/events') && method === 'GET':
                return getEvents();
              case url.match(/\/events\/\d+$/) && method === 'GET':
                return getEventById();
              case url.endsWith('/events') && method === 'POST':
                return createEvent();
              case url.match(/\/events\/\d+$/) && method === 'PUT':
                return updateEvent();
              case url.match(/\/events\/\d+$/) && method === 'DELETE':
                return deleteEvent();
            case url.endsWith('/users/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('/users') && method === 'GET':
                return getUsers();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }    
    }

    // route functions

    function authenticate() {
        const { username, password } = body;
        const user = users.find(x => x.username === username && x.password === password);
        if (!user) return error('Username or password is incorrect');
        return ok({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: 'fake-jwt-token'
        })
    }

    function getUsers() {
        if (!isLoggedIn()) return unauthorized();
        return ok(users);
    }

    // helper functions



    function unauthorized() {
        return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }
    // route functions

    function getEvents() {
        return ok(events.map((x) => basicDetails(x)));
      }
  
      function getEventById() {
        const event = events.find((x) => x.id === idFromUrl());
        return ok(basicDetails(event));
      }
  
      function createEvent() {
        const event = body;
  
        if (events.find((x) => x.id === event.id)) {
          return error(`User with the email ${event.id} already exists`);
        }
  
        // assign event id and a few other properties then save
        event.id = newEventId();
        delete event.confirmPassword;
        events.push(event);
        localStorage.setItem(eventsKey, JSON.stringify(events));
  
        return ok();
      }
  
      function updateEvent() {
        let params = body;
        let event = events.find((x) => x.id === idFromUrl());
  
        if (
          params.email !== event.email &&
          events.find((x) => x.email === params.email)
        ) {
          return error(`User with the email ${params.email} already exists`);
        }
  
        // only update password if entered
        if (!params.password) {
          delete params.password;
        }
  
        // update and save event
        Object.assign(event, params);
        localStorage.setItem(eventsKey, JSON.stringify(events));
  
        return ok();
      }
  
      function deleteEvent() {
        events = events.filter((x) => x.id !== idFromUrl());
        localStorage.setItem(eventsKey, JSON.stringify(events));
        return ok();
      }
  
      // helper functions
  
      function ok(body?: any) {
        return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
      }
  
      function error(message: any) {
        return throwError({ error: { message } }).pipe(
          materialize(),
          delay(500),
          dematerialize()
        ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
      }
  
      function basicDetails(event: any) {
        const { id, category, title, description,image,file, location , day, start} = event;
        return { id, category, title, description,image,file, location  , day, start};
      }
  
      function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
      }
  
      function newEventId() {
        return events.length ? Math.max(...events.map((x) => x.id)) + 1 : 1;
      }
}
}

export let fakeBackendProvider = {
// use fake backend in place of Http service for backend-less development
provide: HTTP_INTERCEPTORS,
useClass: FakeBackendInterceptor,
multi: true
};