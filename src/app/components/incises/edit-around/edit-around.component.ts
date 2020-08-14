import { Component, OnInit } from '@angular/core';
import { InciseService } from 'src/app/services/incise.service';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'
import { DialogDelInc } from 'src/app/components/tasks/tasks.component'
import { Incise } from 'src/app/models/incise';
import { Comm } from 'src/app/models/comm';

@Component({
  selector: 'app-edit-around',
  templateUrl: './edit-around.component.html',
  styleUrls: ['./edit-around.component.css']
})
export class EditAroundComponent implements OnInit {

  newInc: Incise;
  oldInc: Incise;
  dir: string;
  Sel: Incise;

  constructor(
    private inciseService: InciseService, 
    private showAround: ShowAroundComponent,
    private delInc: DialogDelInc,
  ){ }

  ngOnInit(): void {
  }

  setAfter(){
    const C = this.inciseService.selectedIncise
    this.inciseService.getIncises().subscribe(res => {
      const A = this.inciseService.incises = res as Incise[];
      for(var i in A){
        if(C.after === A[i]._id){
          this.editAround(A[i], '*');
          return;
        }
      }
    });
  }

  setBefore(){
    const C = this.inciseService.selectedIncise
    this.inciseService.getIncises().subscribe(res => {
      const A = this.inciseService.incises = res as Incise[];
      for(var i in A){
        if(C.before === A[i]._id){
          this.editAround(A[i], '*');
          return;
        }
      }
    });
  }

  editAround(incise: Incise, direction: string, comm?: Comm){
    this.newInc = incise;
    this.oldInc = this.inciseService.selectedIncise
    this.dir = direction;
    this.playAudio();
    const E = document.getElementById('E');
    if(E.textContent === "" && this.oldInc.content === "" && !this.oldInc.media){
      this.delInc.delIncise(this.oldInc);
      this.showAround.toCenter(this.newInc);
      return;
    }
    this.checkComment(comm);
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/pop_drip.wav";
    audio.load();
    audio.play();
  }

  checkComment(comm?: Comm){
    if(this.oldInc.right[0]
      && this.oldInc.content !== document.getElementById('E').textContent
      && this.oldInc.content !== ""){
      this.createAfterInc(comm)
    } else {
      this.oldInc.media = this.showAround.ImageIncPath;
      this.oldInc.content = document.getElementById('E').textContent;  
      this.setOldInc(comm);
    }
  }

  createAfterInc(comm?: Comm){
    let A = new Incise;
    A.media = this.showAround.ImageIncPath;
    A.content = document.getElementById('E').textContent;
    A.prof = sessionStorage.getItem('currentUserId');
    A.before = this.oldInc._id;
    this.inciseService.postIncise(A).subscribe(res => {
      const C = res as Incise;
      this.oldInc.after = C._id;
      this.setOldInc(comm);
    });
  }

  setOldInc(comm?: Comm){
    if(this.dir === '*'){
      this.inciseService.putIncise(this.oldInc).subscribe(res => {
        res as Incise;
        this.showAround.toCenter(this.newInc);
      });
    } else {
      this.linkStereo1(comm);
    }
  }

  linkStereo1(comm?: Comm){
    switch (this.dir){
      case "Up":
        for(var i in this.oldInc.up){
          if(this.oldInc.up[i] === this.newInc._id){
            this.linkStereo2();
            return;
          }
        }
        this.oldInc.up.push(this.newInc._id);
        break;
      case "Down":
        for(var i in this.oldInc.down){
          if(this.oldInc.down[i] === this.newInc._id){
            this.linkStereo2();
            return;
          }
        }
        this.oldInc.down.push(this.newInc._id);
        break;
      case "Left":
        for(var i in this.oldInc.left){
          if(this.oldInc.left[i].IdComm === this.newInc._id){
            this.linkStereo2();
            return;
          }
        }
        const commt = new Comm;
        commt.IdComm = this.newInc._id;
        this.oldInc.left.push(commt);
        break;
      case "Right":
        for(var i in this.oldInc.right){
          if(this.oldInc.right[i] === this.newInc._id){
            this.linkStereo2(comm);
            return;
          }
        }
        this.oldInc.right.push(this.newInc._id);
        break;
    }
    this.linkStereo2(comm)
  }

  linkStereo2(comm?: Comm){
    this.inciseService.putIncise(this.oldInc).subscribe();
    switch (this.dir){
      case "Up":
        for(var i in this.newInc.down){
          if(this.newInc.down[i] === this.oldInc._id){
            this.linkStereo3();
            return;
          }
        }
        this.newInc.down.push(this.oldInc._id);
        break;
      case "Down":
        for(var i in this.newInc.up){
          if(this.newInc.up[i] === this.oldInc._id){
            this.linkStereo3();
            return;
          }
        }
        this.newInc.up.push(this.oldInc._id);
        break;
      case "Left":
        for(var i in this.newInc.right){
          if(this.newInc.right[i] === this.oldInc._id){
            this.linkStereo3();
            return;
          }
        }
        this.newInc.right.push(this.oldInc._id);
        break;
      case "Right":
        if(comm){
          this.newInc.left.push(comm)
          this.linkStereo3();
          return
        }
        for(var i in this.newInc.left){
          if(this.newInc.left[i].IdComm === this.oldInc._id){
            this.linkStereo3();
            return;
          }
        }
        const commt = new Comm;
        commt.IdComm = this.oldInc._id;
        this.newInc.left.push(commt);
        break;
    }
    this.linkStereo3();
  }

  linkStereo3(){
    this.inciseService.putIncise(this.newInc).subscribe(res => {
      res as Incise;
      if(this.Sel){
        this.showAround.toCenter(this.Sel);
      } else {
        this.showAround.toCenter(this.newInc);
      }
    })
  }

}