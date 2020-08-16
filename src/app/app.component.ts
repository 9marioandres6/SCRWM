import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ShowAroundComponent} from 'src/app/components/incises/show-around/show-around.component'
import { TasksComponent} from 'src/app/components/tasks/tasks.component'
import { SocketService } from 'src/app/services/socket.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent{

  constructor(
    public showAround: ShowAroundComponent,
    public taskComponent: TasksComponent,
    public socketService: SocketService,
    private router: Router,
    ){
      let path = localStorage.getItem('path');
      if(path){
        this.showAround.deepLink(path);
        localStorage.removeItem('path');
        window.location.reload();
      }     
    }

  changeOfRoutes(){
    this.showAround.deepLink(this.router.url);
    const userId = sessionStorage.getItem('currentUserId');
    this.socketService.emit('new user', userId);
  }
  
}