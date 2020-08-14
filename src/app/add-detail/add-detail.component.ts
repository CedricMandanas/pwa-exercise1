import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-add-detail',
  templateUrl: './add-detail.component.html',
  styleUrls: ['./add-detail.component.css']
})
export class AddDetailComponent implements OnInit {
  user: Contact;
  @Input() isInvalid = false;

  constructor(private heroService: ContactService, private messageService: MessageService, private location: Location) { }

  add(name: string, phoneNumber: string, emailAddress: string, birthday: Date): void {
    name = name.trim();
    phoneNumber = phoneNumber.trim();
    emailAddress = emailAddress.trim();
    if (!name || !phoneNumber || !emailAddress || !birthday) { this.isInvalid = true; return; }

    this.heroService.getContacts()
      .subscribe(heroes => {
        var id = this.heroService.contactCount + 1;
        this.heroService.addContact({ id, name, phoneNumber, emailAddress, birthday } as Contact)
          .subscribe(() => this.goBack());
      });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
  }

}
