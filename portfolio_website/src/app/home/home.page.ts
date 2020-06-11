import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

 

 //typewriter effect
 words: string[]=[" Web Developer" ," Mobile developer"," UI/UXDev" ];
 currentText="";

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.typeWriter("",3000,0, false);
  }

  toSection(sectionId){
    let x = document.querySelector(sectionId);
    if(x){
      x.scrollIntoView();
    }
  }
  
  typeWriter(ctext, wait, _wordIndex, _isDeleting){
    var TxtElementTxt="";
    var wordIndex=_wordIndex;
    var isDeleting =_isDeleting;
    var txt=ctext;
    //current index of work
    var current = wordIndex % this.words.length;
    //get full text of current word
    var fulltxt = this.words[current];

    //check if deleting
    if(isDeleting){
      // Remove char
      txt = fulltxt.substring(0, txt.length -1);

    }else {
      // Add char
      txt = fulltxt.substring(0, txt.length +1);
    }

    // Insert txt into element
    TxtElementTxt = txt;

    // initial Type Speed
    let typeSpeed = 300;

    if(isDeleting) {
      typeSpeed /= 2;
    }

    //if word is complete
    if(!isDeleting && txt === fulltxt) {
      //make pause at the end
      typeSpeed= 3000;

      //set the delete to true
      isDeleting= true;

      //txt="";
    }else if(isDeleting && txt === ""){
      isDeleting =false;
      //move to next word
      wordIndex++;
      // pause before start typeing 
      typeSpeed = 500;
    }

    //console.log(TxtElementTxt +" "+ typeSpeed);
    this.currentText=TxtElementTxt;
    setTimeout(()=>{
      this.typeWriter(txt, typeSpeed, wordIndex, isDeleting)
    }, typeSpeed);
  }

  
  
}
