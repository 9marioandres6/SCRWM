import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { ImageIncService } from 'src/app/services/image-inc.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

import { EditAroundComponent } from 'src/app/components/incises/edit-around/edit-around.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { KeyListenerComponent } from 'src/app/components/incises/key-listener/key-listener.component';
import { CopyUrlComponent } from 'src/app/components/incises/copy-url/copy-url.component';
import { NewImageComponent } from 'src/app/components/incises/new-image/new-image.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';

import { ImageInc } from 'src/app/models/image-inc';
import { Incise } from 'src/app/models/incise';

import {MatDialog} from '@angular/material/dialog';

declare var M: any; 

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})
export class IncisesComponent implements OnInit{   

  addHashtag:boolean = false;

  constructor(
    public inciseService: InciseService, 
    public profService: ProfService,
    public imageService: ImageService,
    private imageIncService: ImageIncService,
    public authService: AuthService,
    private socketService: SocketService,
    public editAround: EditAroundComponent,
    public showAround: ShowAroundComponent,
    private keyListener: KeyListenerComponent,
    public profileComponent: ProfileComponent,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
  ){ route.params.subscribe(val => this.ngOnInit()) }

  ngOnInit(): void{
  }  
  
  @HostListener("window:keydown", ['$event']) spaceEvent(event: any){
    this.keyListener.readKey(event);
  }

  zoomMin(){
    this.router.navigate(['']);
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.showAround.toCenter(this.inciseService.selectedIncise);
  }

  zoomMax(){
    if(this.authService.loggedIn()){
      this.router.navigate(['/incises']);
      this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
      this.showAround.toCenter(this.inciseService.selectedIncise); 
      //this.deleteIncises(); 
    }
  }

  HT(){
    if(document.getElementById('E').isContentEditable){
      document.getElementById('E').contentEditable = "false";
      this.addHashtag = true;
    }
  }

  HT2(event: any, HTInput: any){
    if(event.keyCode === 32){
      this.addHashtag = false;
      if(HTInput.value){
        this.inciseService.selectedIncise.hashtag.push(HTInput.value);
        this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      }
      document.getElementById('E').contentEditable = "true";
    }
  }

  diamondSelected(){
    if(this.inciseService.selectedIncise.prof !== this.profService.userProf.userId){
      let C = this.inciseService.selectedIncise;
      if(C._id){
        let P = this.profService.userProf;
        var index = 0;
        while(P.favIncises[index]){
          if(P.favIncises[index] === C._id){
            P.favIncises.splice(index, 1);
            C.diamond --;
            document.getElementById('diamond').style.opacity = "0.2";
            this.profService.putProf(this.profService.userProf).subscribe();
            return;
          }
          index++;
        }
        P.favIncises.push(C._id);
        C.diamond ++;
        document.getElementById('diamond').style.opacity = "1";
        this.profService.putProf(this.profService.userProf).subscribe();
      }  
    }
  }

  anchorSelected(){
    const C = this.inciseService.selectedIncise;
    if(C._id){
      const P = this.profService.userProf;
      let index = 0;
      while (P.anchors[index]){
        if(P.anchors[index] === C._id){
          P.anchors.splice(index, 1);
          document.getElementById('anchor').style.opacity = "0.2";
          this.profService.putProf(this.profService.userProf).subscribe();
          return;
        }
        index++;
      }
      P.anchors.push(C._id);
      document.getElementById('anchor').style.opacity = "1";
      this.profService.putProf(this.profService.userProf).subscribe();
    }  
  }

  deleteIncises(){
    this.inciseService.getIncises().subscribe(res => {
      let C = this.inciseService.incises = res as Incise[];
      for(var i in C){
        this.inciseService.deleteIncise(C[i]._id).subscribe();
      }
      this.deleteImagesInc();
    });
  }

  deleteImagesInc(){
    this.imageIncService.getImages().subscribe(res => {
      let I = this.imageIncService.imagesInc = res as ImageInc[];
      for(var i in I){
        this.imageIncService.deleteImage(I[i]._id).subscribe();
      }
    });
  }

  openDialogDelHashtag(hashtag: string){
    if(document.getElementById('E').isContentEditable){
      localStorage.setItem("HTag", hashtag);
      const dialogRef = this.dialog.open(DialogContent);
      dialogRef.afterClosed().subscribe();
    }
  }

  openDialogNewImageInc(){
    if(this.inciseService.selectedIncise._id){
      const dialogRef = this.dialog.open(NewImageComponent);
      dialogRef.afterClosed().subscribe();  
    } else {
      M.toast({html: "No incise being edited"})

    }
  }

  onenDialogCopyUrl(){
    if(this.inciseService.selectedIncise._id){
      const dialogRef = this.dialog.open(CopyUrlComponent);
      dialogRef.afterClosed().subscribe();  
    } else {
      M.toast({html: "Please select a Scrwm from the lateral right panel"})
    }
  }
}


@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
export class DialogContent {

  constructor(
    public inciseService: InciseService, 
    public showAround: ShowAroundComponent,
  ){ }

  deleteHashtag(){
    const hashtag = localStorage.getItem("HTag");
    let C = this.inciseService.selectedIncise;
    for(var i in C.hashtag){
      if(C.hashtag[i] === hashtag){
        const index = C.hashtag.indexOf(i)+1;
        C.hashtag.splice(index, 1);
        C.content = document.getElementById('E').textContent;
        this.showAround.toCenter(C);
      }
    }
  }

}
