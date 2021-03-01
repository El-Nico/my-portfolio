import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';


interface WorkItem {
  category: string;
  title: string;
  imgurl: string;
  githubUrl: string;
  snapshotId?: string;
}
@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {

  workCollection: AngularFirestoreCollection<WorkItem>;
  workItemsObservable: Observable<WorkItem[]>;
  workItems: WorkItem[];

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.workItemsObservable = this.afs.collection('work-items').snapshotChanges()
      .pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as WorkItem;
          data.snapshotId = a.payload.doc.id;
          return data;
        });
      }));
  }

  ngOnInit() {
    this.workItemsObservable.subscribe(workItems => {
      this.workItems = workItems;
    })
  }

  goToDetail(item) {
    console.log(item.githubUrl)
    var win = window.open(item.githubUrl, '_blank');
    win.focus();
    //this.router.navigateByUrl(item.githubUrl);
    // this.router.navigateByUrl(`project-detail/${snapshotId}`);
    // console.log(snapshotId);
  }

}
