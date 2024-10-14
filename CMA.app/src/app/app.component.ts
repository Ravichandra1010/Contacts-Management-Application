// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { ContactService } from './services/contact.service';
import { Contact } from '../app/models/contact.model'

@Component({
  selector: 'app-root',
  template: `
  <div style="display: flex; align-items: center;margin-down:10px;margin-left: 200px;">
    <img width="60" alt="Angular Logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==">
    <span style="margin-left: 8px;    font-size: xx-large;">Contacts App</span>
</div>
    <div class="container" style="margin-down:10px;">          
      <app-contact-list></app-contact-list>
    </div>
  `,
})
// <app-contact-form (contactAdded)="loadContacts()"></app-contact-form>
export class AppComponent implements OnInit {
  //contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
   // this.loadContacts();
  }

  // loadContacts(): void {
  //   this.contactService.getContacts().subscribe(data => {
  //     this.contacts = data;
  //   });
  // }
}
