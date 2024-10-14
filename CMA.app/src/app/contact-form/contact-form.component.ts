// src/app/contact-form/contact-form.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.model';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contactForm: FormGroup;
  @Input() contact?: Contact;
  @Input() isAddMode?: boolean;
  @Input() isShowForm?: boolean;
  id: number = 0;
  @Output() loadContacts = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();
  showForm: boolean = false;
  submitAttempted = false;
  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    console.log(this.isShowForm)
  }

  ngOnChanges() {
    
    if (this.contact) {
      this.id = this.contact.id;
      this.contactForm.patchValue(this.contact);
    }
  }

  onSubmit(): void {

    this.submitAttempted = true;

    // Manually trigger validation for each control
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      control?.updateValueAndValidity();
    });

    if (this.contactForm.valid) {
      const newContact: Contact = this.contactForm.value;

      if (this.isAddMode) {

        this.contactService.addContact(newContact).subscribe({
          next: () => {
            this.loadContacts.emit();
            this.contactForm.reset();
            alert("Contact information added successfully");
            this.submitAttempted=false;
            this.onClose(); 
          },
          error: (err) => {
            if (err.status === 409) { // Conflict status
              alert(err.error); // Display the error message
            } else {
              console.error(err); // Handle other errors if needed
            }
          }
        });
      }
      else {
        this.contactService.updateContact(newContact, this.id).subscribe({
          next: () => {
            this.loadContacts.emit();
            alert("Contact information updated successfully");
            this.contactForm.reset();
            this.onClose();
          },
          error: (err) => {
            if (err.status === 409) { // Conflict status
              alert(err.error); // Display the error message
            } else {
              console.error(err); // Handle other errors if needed
            }
          }
        });
      }
    }
  }

  onClose() {
    this.isShowForm = false;
    this.toggle.emit();
  }
}
