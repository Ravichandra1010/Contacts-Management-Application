import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.model';
import {  Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact?: Contact;
  isAddMode=true;
  @Output() saveContact = new EventEmitter<Contact>();
  showForm: boolean = true;
  showList: boolean = true; // Initially show the list

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {

    this.contactService.getContacts()
                                .subscribe((result: any) => {
                                  this.contacts = result;
                                   
                                   
                                }, (error: any) => {
                                   
                                });
}

  deleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe(() => {
      this.loadContacts();
    });
  }

  editContact(contact: Contact) {
    this.isAddMode=false;
    this.selectedContact = { ...contact }; // Clone contact for editing
  }
}
