import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Mm1Component } from './mm1/mm1.component';
import { MmsComponent } from './mms/mms.component';
import { MmskComponent } from './mmsk/mmsk.component';
import { Mg1Component } from './mg1/mg1.component';
import { HeaderComponent } from './header/header.component';
import { FlashMessageComponent } from './flash-message/flash-message.component';

@NgModule({
  declarations: [
    AppComponent,
    Mm1Component,
    MmsComponent,
    MmskComponent,
    Mg1Component,
    HeaderComponent,
    FlashMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/mm1',
        pathMatch: 'full'
      },
      {
        path: 'mm1',
        component: Mm1Component
      },
      {
        path: 'mms',
        component: MmsComponent
      },
      {
        path: 'mmsk',
        component: MmskComponent
      },
      {
        path: 'mg1',
        component: Mg1Component
      },
      {
        path: '**',
        redirectTo: '/mm1'
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
