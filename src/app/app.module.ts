import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioRecordingService } from './audio-recording.service';
import { AudioRecoverService } from './audio-recover.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [AudioRecordingService, AudioRecoverService],
  bootstrap: [AppComponent],
})
export class AppModule {}
