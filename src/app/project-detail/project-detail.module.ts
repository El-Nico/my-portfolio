import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailPageRoutingModule } from './project-detail-routing.module';

import { ProjectDetailPage } from './project-detail.page';
import { IconDirective } from './icon.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailPageRoutingModule
  ],
  declarations: [ProjectDetailPage, IconDirective]
})
export class ProjectDetailPageModule {}
