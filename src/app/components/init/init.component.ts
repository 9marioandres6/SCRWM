import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';

import { User } from 'src/app/models/user';
import { Image } from 'src/app/models/image';

import { SignupComponent } from 'src/app/components/signup/signup.component';
import { SigninComponent } from 'src/app/components/signin/signin.component';
import { ProfComponent } from 'src/app/components/prof/prof.component';
import { ListComponent } from 'src/app/components/list/list.component';
import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { IncisesComponent } from 'src/app/components/incises/incises.component';

import {MatDialog} from '@angular/material/dialog';

declare var M: any;

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  imagePath: string;
  userId: string = sessionStorage.getItem('currentUserId');
 
  constructor(
    private imageService: ImageService,
    public authService: AuthService,
    public dialog: MatDialog,
    private signupComponent: SignupComponent,
    private signinComponent: SigninComponent,
    public profComponent: ProfComponent,
    public list: ListComponent,
    public taskComponent: TasksComponent,
    public incisesComponent: IncisesComponent,
  ){}

  ngOnInit(): void {
    this.setUserImage();
  }

  setUserImage(){
    this.imageService.getImages().subscribe(res => {
      let I = this.imageService.images = res as Image[]
      for(var i in I){
        if(I[i].userId === this.userId){
          this.imagePath = I[i].imagePath;
        }
      }
    })
  }

  deleteUsers(){
    this.authService.getUsers().subscribe(res => {
      let U = this.authService.users = res as User[];
      for(var i in U){
        this.authService.deleteUser(U[i]._id).subscribe();
      }
    });
    this.profComponent.deleteProfs();
    sessionStorage.removeItem("currentUserId");
  }

  Register(){
    const dialogRef = this.dialog.open(SignupComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Login() {
    const dialogRef = this.dialog.open(SigninComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
 
}


