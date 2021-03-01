import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  contactModel = {
    name: "",
    subject: "",
    email: "",
    phoneNumber: "",
    message: ""
  }
  constructor() { }

  ngOnInit() { }

  onSubmit() {
    console.log(this.contactModel)
    const sendEmail = firebase.functions().httpsCallable('sendEmail');
    sendEmail(this.contactModel).then(res => {
      if(res.data){
        alert("message sent!");
      }
    });
  }

}
