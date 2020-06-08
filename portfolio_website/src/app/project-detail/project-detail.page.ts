import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {

  projectId
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectId =this.activatedRoute.snapshot.params['id'];
  }

}
