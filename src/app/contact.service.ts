import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Contact } from './contact';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsUrl = "https://10.129.142.88:5000/api/contactitems";
  public contactCount;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
    this.getContacts().subscribe(contacts => this.contactCount = Object.keys(contacts).length)
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactsUrl)
      .pipe(
        tap(_ => this.log('fetched contacts')),
        catchError(this.handleError<Contact[]>('getContact', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }


  getContact(id: number): Observable<Contact> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.get<Contact>(url).pipe(
      tap(_ => this.log(`fetched contact id=${id}`)),
      catchError(this.handleError<Contact>(`getContact id=${id}`))
    );
  }

  updateContact(contact: Contact): Observable<any> {
    return this.http.put(this.contactsUrl, contact).pipe(
      tap(_ => this.log(`updated contact id=${contact.id}`)),
      catchError(this.handleError<any>('updateContact'))
    );
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.contactsUrl, contact).pipe(
      tap((newContact: Contact) => this.log(`added contact w/ id=${newContact.id}`)),
      tap(_ => this.contactCount += 1),
      catchError(this.handleError<Contact>('addContact'))
    );
  }

  deleteContact(contact: Contact | number): Observable<Contact> {
    const id = typeof contact === 'number' ? contact : contact.id;
    const url = `${this.contactsUrl}/${id}`;

    return this.http.delete<Contact>(url).pipe(
      tap(_ => this.log(`deleted contact id=${id}`)),
      catchError(this.handleError<Contact>('deleteContact'))
    );
  }

  searchContacts(term: string): Observable<Contact[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Contact[]>(`${this.contactsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found contact matching "${term}"`) :
        this.log(`no contact matching "${term}"`)),
      catchError(this.handleError<Contact[]>('searchContact', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`ContactService: ${message}`);
  }

}
