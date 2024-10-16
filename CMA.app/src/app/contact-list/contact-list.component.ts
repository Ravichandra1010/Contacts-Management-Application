import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact?: Contact;
  isAddMode = true;
  @Output() saveContact = new EventEmitter<Contact>();
  isShowForm: boolean = false;
  showList: boolean = true; // Initially show the list
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm: string = '';
  isOpen: boolean = true;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts()
      .subscribe(
        (result: any) => {
          this.contacts = result;
        },
        (error: any) => this.handleError(error)
      );
  }

  deleteContact(id: number): void {
    const confirmation = confirm('Are you sure you want to delete this contact?');
    if (confirmation) {
      this.contactService.deleteContact(id).subscribe(
        () => {
          this.loadContacts();
        },
        (error: any) => this.handleError(error)
      );
    }
  }

  editContact(contact: Contact) {
    this.isAddMode = false;
    this.isShowForm = true;
    this.isOpen = false;
    this.selectedContact = { ...contact }; // Clone contact for editing
  }

  // Getter for filtered contacts
  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleOpen() {
    this.isShowForm = !this.isShowForm;
    this.isOpen = !this.isOpen;
    this.isAddMode = true;
  }

  private handleError(error: any): void {
    alert(error.error?.error);
  }
}
