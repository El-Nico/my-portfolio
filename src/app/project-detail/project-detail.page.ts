import { ElementRef, HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { WorkItem } from '../home/work/work.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {

  projectId
  activeImgIndex = 0
  onScrollBoolean: boolean
  projectDetail: WorkItem = {
    category: '',
    title: '',
    imgUrl: [],
    githubUrl: '',
    snapshotId: '',
    techs: [],
    features: [],
    description: '',
    siteUrl: ''
  }
  automateSlide: any
  noBlur = false

  @ViewChild('onScroll', { static: true }) el: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.projectId = this.activatedRoute.snapshot.params['id'];
    let mainWidth = document.getElementById('header-section').clientHeight
    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(
        map((e: Event) => (e.srcElement as Element).scrollTop > mainWidth - 50),
        distinctUntilChanged()).subscribe((data) => {
          this.onScrollBoolean = data
        });
    this.getAllDocs.subscribe((data: WorkItem) => {
      this.projectDetail = data
      setTimeout(() => {
        this.noBlur = true
      }, 200)
      this.automateInterval()
    })
  }

  get getAllDocs() {
    const ref = this.afs.collection('work-items').doc(this.projectId);
    return ref.valueChanges();
  }

  activeDot(i, from?) {
    from !== 'interval' && clearInterval(this.automateSlide);
    this.activeImgIndex = i
    from !== 'interval' && this.automateInterval()

  }
  automateInterval() {
    this.automateSlide = setInterval(() => {
      if (this.projectDetail.imgUrl.length === this.activeImgIndex + 1) {
        this.activeDot(0, 'interval')
      } else {
        this.activeDot(++this.activeImgIndex, 'interval')
      }
    }, 10000)
  }

}
