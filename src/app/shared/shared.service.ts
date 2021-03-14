import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {


  constructor() {
  }

  scroll = "#Home"

  setDefaultScroll(scrollToSectionId: string) {
    this.scroll = scrollToSectionId;
  }
  getDefaultScroll() {
    return this.scroll
  }
}
