import { Component, OnInit } from '@angular/core';
import { InciseService } from 'src/app/services/incise.service';
import { AuthService } from 'src/app/services/auth.service';
import { EditAroundComponent } from 'src/app/components/incises/edit-around/edit-around.component';
import { Incise } from 'src/app/models/incise';
import { Comm } from 'src/app/models/comm';

declare var M: any; 

@Component({
  selector: 'app-key-listener',
  templateUrl: './key-listener.component.html',
  styleUrls: ['./key-listener.component.css']
})
export class KeyListenerComponent implements OnInit {

  constructor(
    public inciseService: InciseService, 
    public authService: AuthService,
    public editAround: EditAroundComponent,
  ){ }

  ngOnInit(): void {
  }
  
  readKey(event: any){
    if(this.authService.loggedIn() && this.inciseService.selectedIncise._id){
      if(event.keyCode === 13){   
        if(window.getSelection().toString() != ""){
          this.ToComment(window.getSelection());
        } else {
          this.newIncise("Down");
        }
      } else if(event.shiftKey){
        if(event.keyCode === 37){
          this.newIncise("Left");
        } else if(event.keyCode === 38){
          this.newIncise("Up");
        } else if(event.keyCode === 39){
          M.toast({ html: "Please select what you want to comment after pressing Ctrl key" })
        } else if(event.keyCode === 40){
          this.newIncise("Down");
        }
      }
    }
  }

  ToComment(event: any){
    document.getElementById('E').contentEditable = "false";
    if(this.authService.loggedIn()){
      const comm = new Comm;
      comm.commt = event.toString().trim();
      comm.initial = event.getRangeAt(0).startOffset;
      comm.final = event.getRangeAt(0).endOffset;
      comm.IdComm = this.inciseService.selectedIncise._id;
      this.newIncise("Right", comm);    
    }
  }

  newIncise(direction: string, comm?: Comm){
    const A = new Incise;
    this.inciseService.postIncise(A).subscribe(res => {
      let C = res as Incise;
      C.prof = sessionStorage.getItem('currentUserId');
      this.editAround.editAround(C, direction, comm);
    })
  }

}
