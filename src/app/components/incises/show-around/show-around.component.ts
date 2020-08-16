import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { ImageIncService } from 'src/app/services/image-inc.service';
import { AuthService } from 'src/app/services/auth.service';

import { Incise } from 'src/app/models/incise';
import { Image } from 'src/app/models/image';
import { ImageInc } from 'src/app/models/image-inc';

import { TestingComponent } from 'src/app/components/testing/testing.component';

@Component({
  selector: 'app-show-around',
  templateUrl: './show-around.component.html',
  styleUrls: ['./show-around.component.css']
})
export class ShowAroundComponent implements OnInit {

  Above: any = [];
  Below: any = [];
  Left: any = [];
  Right: any = [];
  Hashtags: any = [];
  ImageIncPath: string = "";

  constructor(
    public inciseService: InciseService,
    public profService: ProfService,
    public imageService: ImageService,
    public imageIncService: ImageIncService,
    public testing: TestingComponent,
    private authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  deepLink(url: string){
    if(url.slice(0,9) === "/incises/"){
      this.inciseService.getIncises().subscribe(res => {
        const A = this.inciseService.incises = res as Incise[];
        for(var i in A){
          if(A[i]._id === url.slice(9)){
            this.toCenter(A[i]);
          }
        }
      });
    }
  }

  setByDefectInc(){
    if(!this.inciseService.selectedIncise._id){
      this.inciseService.getIncises().subscribe(res => {
        const A = this.inciseService.incises = res as Incise[];
        for(var i in A){
          if(A[i]._id === localStorage.getItem('byDefectIncise')){
            this.toCenter(A[i]);
            return;
          } 
        }
        for(var i in A){
          if(Math.max(A[i].diamond)){
            this.toCenter(A[i])
            return;
          }
        }
      })
    }
  }

  saveLast(incise: Incise){
    let C = this.inciseService.selectedIncise;
    if(C._id){
      C.content = document.getElementById('E').textContent;
      this.inciseService.putIncise(C).subscribe();
      this.profService.putProf(this.profService.userProf)
    }
    this.toCenter(incise)
  }

  toCenter(incise: Incise){
    this.resetConstants();
    localStorage.setItem('byDefectIncise', incise._id);
    this.inciseService.selectedIncise = incise;
    this.showAround(incise);
    this.setImageInc(incise);
    this.setImage(incise);
    this.showHashtag(incise);
    this.isEditable(incise);
    if(this.authService.loggedIn()){
      this.setDiamond(incise);
      this.setVistas(incise);
      this.setAnchor(incise);
    }
  }

  setVistas(incise: Incise){
    if(incise.prof !== sessionStorage.getItem('currentUserId')){
      incise.vistas ++;
    }
  }

  resetConstants(){
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
    this.Hashtags = [];
    this.ImageIncPath = "";
  }

  setImageInc(incise: Incise){
    this.imageIncService.getImages().subscribe(res => {
      const I = this.imageIncService.imagesInc = res as ImageInc[]
      for(var i in I){
        if(I[i].associatedIncId === incise._id){
          this.ImageIncPath = I[i].imagePath;
        }
      }
    })
  }

  showAround(incise: Incise) {
    this.inciseService.getIncises().subscribe(res => {
      const D = this.inciseService.incises = res as Incise[];
      var q = 0;
      let color = "";
      document.getElementById('E').textContent = incise.content;
      for (var i in D) {
        for (var j in incise.right) {
          if (incise.right[j] === D[i]._id) {
            if (D[i].left[0]) {
              let C = document.getElementById('E').innerHTML;
              //let A = C.substring(D[i].left[0].initial, D[i].left[0].final);
              let rep = C.replace(D[i].left[0].commt, (x) => {
                if (q === 0) {
                  color = x.bold()
                } else if (q === 1) {
                  color = x.fontcolor("bluish")
                } else if (q === 2) {
                  color = x.fontcolor("orange")
                } else if (q === 3) {
                  color = x.fontcolor("green")
                } else if (q === 4) {
                  color = x.fontcolor("red")
                }
                q++;
                return color
              });
              if(q < 6){
                document.getElementById('E').innerHTML = rep;
              }
            }
            this.Right.push(D[i]);
          }
        }
        for (var k in incise.down) {
          if (incise.down[k] === D[i]._id) {
            this.Below.push(D[i]);
          }
        }
        for (var l in incise.left) {
          if (incise.left[l].IdComm === D[i]._id) {
            this.Left.push(D[i]);
          }
        }
        for (var m in incise.up) {
          if (incise.up[m] === D[i]._id) {
            this.Above.push(D[i]);
          }
        }
      }
    });
  }

  isEditable(incise: Incise) {
    if(incise.prof === sessionStorage.getItem('currentUserId') && !incise.after) {
      document.getElementById('E').contentEditable = "true";
      document.getElementById('E').focus();
    } else {
      document.getElementById('E').contentEditable = "false";
    }
  }

  setDiamond(incise: Incise){
    this.testing.checkProf("show-around 144");
    const P = this.profService.userProf
    for(var i in P.favIncises){
      if(P.favIncises[i] === incise._id){
        document.getElementById('diamond').style.opacity = "1";
        return
      }
    }
    document.getElementById('diamond').style.opacity = "0.2";  
  }  

  setAnchor(incise: Incise){
    const P = this.profService.userProf
    for(var i in P.anchors){
      if(P.anchors[i] === incise._id){
        document.getElementById('anchor').style.opacity = "1";
        return
      }
    }
    document.getElementById('anchor').style.opacity = "0.2";  
  }

  setImage(incise: Incise) {
    this.imageService.getImages().subscribe(res => {
        this.imageService.images = res as Image[];
        const I = this.imageService.images;
        for (var i in I) {
          if (I[i].userId === this.inciseService.selectedIncise.prof) {
            this.imageService.selectedImage = I[i];
            return;
          }
        }
      });
    this.imageService.selectedImage = new Image;
  }

  showHashtag(incise: Incise) {
    for (var i in incise.hashtag) {
      this.Hashtags.push(incise.hashtag[i]);
    }
  }
}
