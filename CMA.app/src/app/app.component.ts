// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { ContactService } from './services/contact.service';
import { Contact } from '../app/models/contact.model'

@Component({
  selector: 'app-root',
  template: `
    <div class="container">          
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
