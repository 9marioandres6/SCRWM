import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfService } from 'src/app/services/prof.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScrwmService } from 'src/app/services/scrwm.service';


import { Image } from 'src/app/models/image';
import { Prof } from 'src/app/models/prof';
import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  Own: boolean = false;
  Contact: boolean = false;
  Anchor: boolean = false;
  Diamond: boolean = false;
  Header: boolean = true;
  @Output() propagar = new EventEmitter<any>();

  constructor(
    private inciseService: InciseService,
    private imageService: ImageService,
    private profService: ProfService,
    public authService: AuthService,
    public scrwmService: ScrwmService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  filterByOwns(){
    this.Own = !this.Own;
    if(this.Own){
      if(this.Contact){
        this.Contact = !this.Contact;
        document.getElementById('contactBtn').style.backgroundColor = 'rgb(224, 232, 251)';
      }
      document.getElementById('ownBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('ownBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  filterByContacts(){
    this.Contact = !this.Contact;
    if(this.Contact){
      if(this.Own){
        this.Own = !this.Own;
        document.getElementById('ownBtn').style.backgroundColor = 'rgb(224, 232, 251)';
      }
      document.getElementById('contactBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('contactBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }
  
  filterByAnchors(){
    this.Anchor = !this.Anchor;
    if(this.Anchor){
      document.getElementById('anchorBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('anchorBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  filterByHeader(){
    this.Header = !this.Header;
    if(this.Header){
      document.getElementById('headerBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('headerBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  getList(){
    this.inciseService.getIncises().subscribe(res => {
      const A = this.inciseService.incises = res as Incise[]; 
      this.imageService.getImages().subscribe(res => {
        const I = this.imageService.images = res as Image[];
        this.profService.getProfs().subscribe(res => {
          const P = this.profService.profs = res as Prof[];
          this.getAll(A, I, P);
        });
      });
    });
  }

  getAll(A: Incise[], I: Image[], P: Prof[]){
    let unfilteredList = [];
    for(var i in A){
      if(A[i].publicity === true || A[i].prof === sessionStorage.getItem('currentUserId')){ 
        let image = {};
        for(var j in I){
          if(A[i].prof === I[j].userId){
            image = I[j];
          }
        }
        for(var k in P){
          if(A[i].prof === P[k].userId){
            unfilteredList.push({"incise" : A[i], "image" : image, "prof" : P[k]});
          }
        }
      }else for(var l in this.profService.userProf.following){
        if(A[i]._id === this.profService.userProf.following[l]){
          let image = {};
          for(var j in I){
            if(A[i].prof === I[j].userId){
              image = I[j];
            }
          }
          for(var k in P){
            if(A[i].prof === P[k].userId){
              unfilteredList.push({"incise" : A[i], "image" : image, "prof" : P[k]});
            }
          }
        }
      }
    }
  this.filterOwns(unfilteredList.sort().reverse());
  }

  filterOwns(unfilteredList: any[]){
    let filterOwn = [];
    if(this.Own){
      filterOwn = unfilteredList.filter( w =>  w.prof.userId === this.profService.userProf.userId);
    } else { filterOwn = unfilteredList }
    this.filterContacts(filterOwn)
  }

  filterContacts(filterOwn: any){
    let filterContact = [];
    if(this.Contact){
      filterContact = filterOwn.filter(w => {
        for(var q in this.profService.userProf.following){
          if(w.prof._id === this.profService.userProf.following[q]){
            return this.profService.userProf.following[q];
          };
        }
      });
    } else { filterContact = filterOwn }
  this.filterAnchors(filterContact)
  }

  filterAnchors(filterContact: any[]){
    let filterAnchor = [];
    if(this.Anchor){
      filterAnchor = filterContact.filter(w => {
        for(var p in this.profService.userProf.anchors){
          if(w.incise._id === this.profService.userProf.anchors[p]){
            return this.profService.userProf.anchors[p];
          }
        }    
      })
    } else { filterAnchor = filterContact }
    this.filterHeaders(filterAnchor);
  }

  filterHeaders(filterAnchor: any[]){
    let filterHeader = [];
    if(this.Header){
      filterHeader = filterAnchor.filter(w => w.incise.title);
    } else { filterHeader = filterAnchor }
    this.scrwmService.searchList = this.scrwmService.taskList = filterHeader;
    this.enviar(this.scrwmService.taskList);
  }

  searcher(event: any){
    let list = this.scrwmService.taskList;
    if(event.includes('@')){
      list = this.scrwmService.searchList.filter(w => w.prof.nickname.toLowerCase().includes(event.toLowerCase().substring(1)));
    } else {
      list = this.scrwmService.searchList.filter(w => w.incise.title.toLowerCase().includes(event.toLowerCase())
      || w.incise.subtitle.toLowerCase().includes(event.toLowerCase())
      || w.incise.content.toLowerCase().includes(event.toLowerCase())); 
    }
    this.enviar(list);
  }

  enviar(list: Scrwm[]){
    this.propagar.emit(list);
  }


}
