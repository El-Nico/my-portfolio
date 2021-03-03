import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      'imgUrl': new FormControl(null),
      'githubUrl': new FormControl(null),
    })
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
    this.formGroup.setValue({
      'title': this.currentItem.title,
      'category': this.currentItem.category,
      'imgUrl': this.currentItem.imgUrl,
      'githubUrl': this.currentItem.githubUrl
    })
  }

  onFileSelected(event) {
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
              this.formGroup.patchValue({ 'imgUrl': url })
              this.imgUpload = false
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  saveItem() {
    if(this.updateMode){
      this.adminService.updateWorkDetail(this.formGroup.value,this.currentItem.snapshotId)
      .then(data=>{
         this.showNotification('Update Success')
         this.goBack()
      })
    } else{
      this.adminService.saveWorkDetail(this.formGroup.value)
      .then(data=>{
        if(data){
         this.showNotification('Added')
         this.goBack()
        }
      })
    }
  }

  deleteItem() {
    this.adminService.deleteWorkDetail(this.currentItem.snapshotId).then((data)=>{
      this.showNotification('Delete Success')
      this.goBack()
    })
  }



  logOut() {
    this.router.navigate(['/login'])
    localStorage.removeItem('user');
  }

  goBack(){
    this.editMode = false
    this.updateMode = false
  }

  addNewWork(){
    this.formGroup.setValue({
      'title': null,
      'category': null,
      'imgUrl': null,
      'githubUrl': null
    })
    this.editMode = true
  }

  showNotification(string){
    this.notify = string
    setTimeout(()=>{
      this.notify=null},5000)
  }

}