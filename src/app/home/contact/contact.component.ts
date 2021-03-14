import { Component, OnInit } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  onSubmit(e) {
    emailjs.sendForm('portfolio_contact_servic', 'contact_form', e.target as HTMLFormElement, 'user_DR2HeUChM4rTXv0GdHL3q')
      .then((result: EmailJSResponseStatus) => {
        // console.log(result.text);
        window.location.reload();
      }, (error) => {
        // console.log(error.text);
      });
  }
}
