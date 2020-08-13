import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { AuthGuard } from '../auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';

import { IncisesComponent, DialogContent } from '../components/incises/incises.component';
import { SignupComponent } from '../components/signup/signup.component';
import { SigninComponent } from '../components/signin/signin.component';
import { TasksComponent, DialogHeader, DialogNewScrwm, DialogDelInc } from '../components/tasks/tasks.component';
import { InitComponent } from '../components/init/init.component';
import { ShowAroundComponent } from '../components/incises/show-around/show-around.component';
import { EditAroundComponent } from '../components/incises/edit-around/edit-around.component';
import { CopyUrlComponent } from '../components/incises/copy-url/copy-url.component';
import { NewImageComponent } from '../components/incises/new-image/new-image.component';
import { KeyListenerComponent } from '../components/incises/key-listener/key-listener.component';
import { ProfComponent } from '../components/prof/prof.component'
import { ProfileComponent } from '../components/profile/profile.component'
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { TestingComponent } from '../components/testing/testing.component';
import { ChatComponent } from '../components/chat/chat.component';
import { ListComponent } from 'src/app/components/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    IncisesComponent,
    DialogContent,
    SignupComponent,
    SigninComponent,
    TasksComponent,
    DialogHeader,
    DialogNewScrwm,
    InitComponent,
    ChatComponent,
    ShowAroundComponent,
    KeyListenerComponent,
    ProfComponent,
    ProfileComponent,
    ListComponent,
    DialogDelInc,
    CopyUrlComponent, 
    NewImageComponent,
    ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    AuthGuard,
    TasksComponent,
    DialogHeader,
    DialogNewScrwm,
    IncisesComponent,
    SigninComponent,
    ShowAroundComponent,
    EditAroundComponent,
    KeyListenerComponent,
    SignupComponent,
    SigninComponent,
    ProfComponent,
    ProfileComponent,
    CopyUrlComponent,
    InitComponent,
    TestingComponent,
    DialogDelInc,
    ChatComponent,
    NewImageComponent,
    ListComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [ChatComponent]
})
export class AppModule { }
