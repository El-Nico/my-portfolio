import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: AngularFirestore) { }

  saveWorkDetail(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("work-items")
        .add(data)
        .then(res => {resolve(res)}, err => reject(err));
    });
  }

  updateWorkDetail(data,id) {
    return new Promise((resolve,rejects)=>{
      this.firestore
      .collection("work-items")
      .doc(id)
     .update(data).then(res=>{resolve(res)},err=> rejects(err));
    })
  }

  deleteWorkDetail(id) {
    return new Promise((resolve, reject)=>{this.firestore
      .collection("work-items")
      .doc(id)
      .delete()        
      .then(res => {resolve(res)}, err => reject(err));})
  }
}