import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contactForm: FormGroup;
  @Input() contact?: Contact;
  @Input() isAddMode?: boolean;
  id: number =0;
  @Output() loadContacts = new EventEmitter<void>();
  showForm: boolean = false;
  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges() {
    if (this.contact) {
      console.log(this.isAddMode);
      this.id=this.contact.id;
      this.contactForm.patchValue(this.contact);
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const newContact: Contact = this.contactForm.value;

      if (this.isAddMode) {
        this.contactService.addContact(newContact).subscribe(() => {
          this.loadContacts.emit();
          this.contactForm.reset();
        });
      }
      else{
        this.contactService.updateContact(newContact,this.id).subscribe(() => {
          this.loadContacts.emit();
        });
      }
    }
  }
}
