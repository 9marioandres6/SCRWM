import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { InciseService } from 'src/app/services/incise.service';
import { ImageIncService } from 'src/app/services/image-inc.service';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { ImageInc } from 'src/app/models/image-inc';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-new-image',
  templateUrl: './new-image.component.html',
  styleUrls: ['./new-image.component.css']
})
export class NewImageComponent implements OnInit {

  constructor(public inciseService: InciseService,
    public imageIncService: ImageIncService,
    public showAround: ShowAroundComponent,
    public browserModule: BrowserModule,
    public commonModule: CommonModule,  
  ){ }

  ngOnInit(): void {
  }

  imageIncPath = this.setImageInc();
  
  setImageInc(){
    if(this.showAround.ImageIncPath){
      return this.inciseService.env + this.showAround.ImageIncPath;
    } else {
      return 'assets/image.png';
    }
  }

  file: File;
  photoSel: string | ArrayBuffer;

  onPhotoSelected(event: HTMLInputEvent): void {
    if(event.target.files && event.target.files[0]){    // confirma si existe un archivo subido
      this.file = <File>event.target.files[0];          // guarda el archivo en file
      const reader = new FileReader();                   // para que se vea en pantalla
      reader.onload = e => this.photoSel = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  insertImageInc(){
    if(this.photoSel){
      this.imageIncService.getImages().subscribe(res => {
        const A = this.imageIncService.imagesInc = res as ImageInc[];
        for(var i in A){
          if(A[i].associatedIncId === this.inciseService.selectedIncise._id){
            this.imageIncService.deleteImage(A[i]._id).subscribe();
          }
        }
        this.chargeNewImageInc();
      });  
    }
  }

  chargeNewImageInc(){
    const A = this.imageIncService.selectedImageInc = new ImageInc;
    A.associatedIncId = this.inciseService.selectedIncise._id;
    A.userId = sessionStorage.getItem('currentUserId');
    this.imageIncService.postImage(A, this.file).subscribe(res => {
      this.getImage();
    });
  }

  getImage(){
    this.imageIncService.getImages().subscribe(res => {
      const A = this.imageIncService.imagesInc = res as ImageInc[];
      for(var i in A){
        if(A[i].associatedIncId = this.inciseService.selectedIncise._id){
          this.imageIncService.selectedImageInc = A[i];
          this.showAround.toCenter(this.inciseService.selectedIncise);
          return
        }
      }
    });
  }
}
