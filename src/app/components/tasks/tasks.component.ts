import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { InciseService } from 'src/app/services/incise.service';
import { AuthService } from 'src/app/services/auth.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { ListComponent } from 'src/app/components/list/list.component';

import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';
import { ImageInc } from 'src/app/models/image-inc';

import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment'; 

import { ImageIncService } from 'src/app/services/image-inc.service';

declare var M: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {

  panelOpenState = false;
  taskList: Scrwm[];
  UserId = sessionStorage.getItem('currentUserId');
  dragged: Incise;
 
  constructor(
    public inciseService: InciseService,
    public authService: AuthService,
    public showAround: ShowAroundComponent,
    private list: ListComponent,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void { 
    if(localStorage.getItem('byDefectIncise')){
      this.showAround.setByDefectInc();
    }
  }

  procesaPropagar(event: any){
    this.taskList = event
  }

  drag(incise: Incise){
    this.dragged = incise;
  }

  lastEdited(updatedAt: string){
    return moment(updatedAt).startOf('hour').fromNow();
  }

  created(createdAt: string){
    return moment(createdAt).format('MMMM Do YYYY, h:mm:ss a');
  }

  openDialogHeader(){
    let C = this.inciseService.selectedIncise;
    if(C.prof !== sessionStorage.getItem('currentUserId')){
        M.toast({html: "You can only edit headers of your own incises"});
    } else {
      if(!C._id){
        M.toast({html: "No incise selected"});
      } else {
        const dialogRef = this.dialog.open(DialogHeader);
        dialogRef.afterClosed().subscribe(res => {
          this.inciseService.getIncises().subscribe(res => {
            this.inciseService.incises = res as Incise[];
          });
        });
      }  
    }
  }

  OpendialogDelInc(incise: Incise){
    this.inciseService.selectedIncise = incise;
    const dialogRef = this.dialog.open(DialogDelInc);
    dialogRef.afterClosed().subscribe();
  }

}


@Component({
  selector: 'dialog-header',
  templateUrl: 'dialog-header.html',
})
export class DialogHeader{

  constructor(
    public inciseService: InciseService,
    public taskComponent: TasksComponent,
  ){}

  setHeader(form: NgForm){
    let C = this.inciseService.selectedIncise;
    C.title = form.value.title;
    C.subtitle = form.value.subtitle;
    if(form.value.publicity === true){
      C.publicity = true;
    } else if(form.value.publicity === false) {
      C.publicity = false;
    }
    this.inciseService.putIncise(C)
    .subscribe(res => {
    });
  }
}


@Component({
  selector: 'dialog-new-scrwm',
  templateUrl: 'dialog-new-scrwm.html',
})
export class DialogNewScrwm{

  constructor(
    public inciseService: InciseService, 
    public list: ListComponent,
    public dialog: MatDialog,
  ){ }

  openDialogNewScrwm(){
    if(this.inciseService.selectedIncise._id){
      this.inciseService.putIncise(this.inciseService.selectedIncise).subscribe(res => {
      });  
    }
    let C = new Incise;
    this.inciseService.postIncise(C).subscribe(res => {
      this.inciseService.selectedIncise = res as Incise;
      const dialogRef = this.dialog.open(DialogNewScrwm);
      dialogRef.afterClosed().subscribe();      
    })
  }

  newIncise(form: NgForm){
    const incise = this.inciseService.selectedIncise;
    incise.title = form.value.title;
    incise.subtitle = form.value.subtitle;
    incise.prof = sessionStorage.getItem('currentUserId');
    if(form.value.publicity === true){
      incise.publicity = true;
    } else if(form.value.publicity === false) {
      incise.publicity = false;
    }
    this.inciseService.postIncise(incise).subscribe(res => {
      this.inciseService.getIncises().subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.list.getList();
        window.location.reload();
        })
    });
  }

}


@Component({
  selector: 'dialog-del-inc',
  templateUrl: 'dialog-del-inc.html',
})
export class DialogDelInc{

  constructor(
    public inciseService: InciseService, 
    public showAround: ShowAroundComponent,
    public imageIncService: ImageIncService,
    public list: ListComponent,
  ){ }

  deleteIncise(){
    let C = this.inciseService.selectedIncise;
    this.delIncise(C);
    document.getElementById('E').textContent = "";
    const D = new Incise;
    this.showAround.toCenter(D);
    this.list.getList();
    window.location.reload();
  }

  delIncise(C: Incise){
    this.inciseService.deleteIncise(C._id).subscribe();
    console.log("antes de removeLink")
    this.removeLinks(C._id);
    if(C.media){ 
      this.delImage(C);
    };
  }

  removeLinks(id: string){
    console.log(id)
    this.inciseService.getIncises().subscribe(res =>{
      let C = res as Incise[];
      for(var i in C){
        var z = 0
        if(C[i].up.indexOf(id) != -1){
          C[i].up.splice(C[i].up.indexOf(id), 1);
          z ++;
        }
        if(C[i].down.indexOf(id) != -1){
          C[i].down.splice(C[i].down.indexOf(id), 1);
          z ++;
        }
        if(C[i].right.indexOf(id) != -1){
          C[i].right.splice(C[i].right.indexOf(id), 1);
          z ++;
        }
        for(var j in C[i].left){
          if(C[i].left[j].IdComm === id){
            const index = C[i].left.indexOf(C[i].left[j])
            C[i].left.splice(index, 1);
            z ++;
          }
        }
        if(C[i].after === id){
          C[i].after = "";
          z ++;
        }
        if(C[i].before === id){
          C[i].before = "";
          z ++;
        }
        if(z > 0){
          this.inciseService.putIncise(C[i]).subscribe();  
        }
      }
    });
  }

  delImage(C: Incise){
    this.imageIncService.getImages().subscribe(res => {
      let I = res as ImageInc;
      for(var i in I){
        if(I[i].imagePath === C.media){
          this.imageIncService.deleteImage(I[i]._id).subscribe();
        }
      }
    })
  }

}
