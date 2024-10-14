// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { Observable,throwError  } from 'rxjs';
import { Contact } from '../models/contact.model';
import { catchError,map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://localhost:7273/Contacts';

  constructor(private http: HttpClient) {}

getContacts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`)
            .pipe(
                map((response: any) => {
                    if (response.success != false) {
                        return response;
                    } else {
                        throw new Error(response.data);
                    }
                })
            );
    
}

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(contact: Contact, id:number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
