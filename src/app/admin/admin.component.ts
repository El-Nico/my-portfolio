import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { WorkItem } from '../home/work/work.component';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  workItems: WorkItem[];
  workItemsObservable: Observable<WorkItem[]>
  editMode: boolean
  editIndex: number
  currentItem: WorkItem
  formGroup: FormGroup

  imageUrlSub: Observable<any>
  imgurl
  updateMode: boolean
  notify: string
  imgUpload: boolean
  constructor(private router: Router,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private adminService: AdminService) {
    this.workItemsSub()
  }

  ngOnInit() {
    this.workItemsObservable.subscribe(workItems => {
      this.workItems = workItems
    })
    this.formGroup = this.fb.group({
      'title': new FormControl(null, Validators.email),
      'category': new FormControl(null),
      imgUrl: this.fb.array([]),
      techs: this.fb.array([]),
      features: this.fb.array([]),
      'githubUrl': new FormControl(null),
      'description': new FormControl(null),
      'siteUrl': new FormControl(null)
    })
  }

  get imgUrl(): FormArray {
    return this.formGroup.get("imgUrl") as FormArray
  }

  get techs(): FormArray {
    return this.formGroup.get("techs") as FormArray
  }

  get features(): FormArray {
    return this.formGroup.get("features") as FormArray
  }

  newImgUrl(): FormGroup {
    return this.fb.group({
      url: '',
    })
  }

  newtech(): FormGroup {
    return this.fb.group({
      type: '',
      tech: '',
      iconHTML: ''
    })
  }

  newFeature(): FormGroup {
    return this.fb.group({
      feature: '',
    })
  }

  addimgUrl() {
    this.imgUrl.push(this.newImgUrl());
  }

  addingtech() {
    this.techs.push(this.newtech());
  }

  addingFeature() {
    this.features.push(this.newFeature());
  }

  removeImgUrl(i?: number) {
    this.imgUrl.removeAt(i);
  }

  removetech(i?: number) {
    this.techs.removeAt(i);
  }

  removeFeature(i?: number) {
    this.features.removeAt(i);

  }

  workItemsSub() {
    this.workItemsObservable = this.afs.collection('work-items').snapshotChanges()
      .pipe(map(changes => {
        return changes.map((a: any) => {
          const data = a.payload.doc.data() as WorkItem;
          data.snapshotId = a.payload.doc.id;
          return data;
        });
      }));
  }

  editItem(index) {
    this.editIndex = index
    this.editMode = true
    this.currentItem = this.workItems[index]
    this.updateMode = true
    this.createArrayForm(this.currentItem.features, 'feature')
    this.createArrayForm(this.currentItem.imgUrl, 'img')
    this.createArrayForm(this.currentItem.techs, 'tech')
    this.formGroup.setValue({
      'title': this.currentItem.title,
      'category': this.currentItem.category,
      'features': typeof this.currentItem.features === 'object' ? this.currentItem.features : this.formGroup.value.features,
      'techs': typeof this.currentItem.techs === 'object' ? this.assignTech() : this.formGroup.value.techs,
      'imgUrl': typeof this.currentItem.imgUrl === 'object' ? this.currentItem.imgUrl : [{ url: this.currentItem.imgUrl }],
      'githubUrl': this.currentItem.githubUrl,
      'description': this.currentItem.description ? this.currentItem.description : null,
      'siteUrl': this.currentItem.siteUrl ? this.currentItem.siteUrl : null
    })
  }

  assignTech() {
    // console.log(this.currentItem.techs)
    return this.currentItem.techs.map((el: any) => {
      return { 'type': el.type, 'tech': el.tech, 'iconHTML': !el.iconHTML ? null : el.iconHTML }
    })
  }
  createArrayForm(item, type) {
    if (typeof item === 'object') {
      item.forEach((el) => {
        type === 'feature' && this.addingFeature()
        type === 'img' && this.addimgUrl()
        type === 'tech' && this.addingtech()
      })
    } else {
      type === 'feature' && this.addingFeature()
      type === 'img' && this.addimgUrl()
      type === 'tech' && this.addingtech()
    }
  }

  onFileSelected(event, i) {
    this.imgUpload = true
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `workImg/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`workImg/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.imageUrlSub = fileRef.getDownloadURL();
          this.imageUrlSub.subscribe(url => {
            if (url) {
              this.imgurl = url;
              this.showNotification('Image Uploaded')
              this.imgUrl.at(i).setValue({ 'url': url })
              this.imgUpload = false
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          // console.log(url);
        }
      });
  }

  saveItem() {
    if (this.updateMode) {
      this.adminService.updateWorkDetail(this.formGroup.value, this.currentItem.snapshotId)
        .then(data => {
          this.showNotification('Update Success')
          this.goBack()
        })
    } else {
      this.adminService.saveWorkDetail(this.formGroup.value)
        .then(data => {
          if (data) {
            this.showNotification('Added')
            this.goBack()
          }
        })
    }
  }

  deleteItem() {
    this.adminService.deleteWorkDetail(this.currentItem.snapshotId).then((data) => {
      this.showNotification('Delete Success')
      this.goBack()
    })
  }



  logOut() {
    this.router.navigate(['/login'])
    localStorage.removeItem('user');
  }

  goBack() {
    this.editMode = false
    this.updateMode = false
    // this.formGroup.reset()
    this.formGroup = this.fb.group({
      'title': new FormControl(null, Validators.email),
      'category': new FormControl(null),
      imgUrl: this.fb.array([]),
      techs: this.fb.array([]),
      features: this.fb.array([]),
      'githubUrl': new FormControl(null),
      'description': new FormControl(null),
      'siteUrl': new FormControl(null)
    })
  }

  async addNewWork() {
    await this.formGroup.setValue({
      'title': null,
      'category': null,
      'imgUrl': [],
      'techs': [],
      'features': [],
      'githubUrl': null,
      'description': null,
      'siteUrl': null
    })
    this.editMode = true
  }

  showNotification(string) {
    this.notify = string
    setTimeout(() => {
      this.notify = null
    }, 5000)
  }

}