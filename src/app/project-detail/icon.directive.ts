import { Input, OnInit } from '@angular/core';
import { Directive, ElementRef } from '@angular/core';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appIcon]'
})
export class IconDirective implements OnInit {

  @Input() appIcon: string
  @Input() tech: string

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    setTimeout(() => {
      let techArray = this.tech.split(',')
      let numberIcon = this.appIcon.match(/<\/ion-icon>/g)
      const id = this.el.nativeElement.id
      document.getElementById(id).innerHTML = this.appIcon
      if (numberIcon && techArray.length !== numberIcon.length) {
        techArray.forEach((el) => {
          if (el.toLowerCase().includes('type')) {
            var node = document.createElement("span");
            node.style.backgroundColor = "#333"
            node.style.color = "white"
            node.style.fontWeight = "800"
            node.style.padding = "2px 4px"
            node.style.fontSize = "15px"
            var textnode = document.createTextNode(('TS').toUpperCase());
            node.appendChild(textnode);
            document.getElementById(id).appendChild(node);
          }
        })
      }
    }, 0)
  }

}