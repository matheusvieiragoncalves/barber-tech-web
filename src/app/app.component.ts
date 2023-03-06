import { Component } from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  AudioRecordingService,
  IRecordedAudioOutput,
} from './audio-recording.service';
import { AudioRecoverService } from './audio-recover.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'barber-tech-web';

  isRecording = false;
  recordedTime: any;
  blobUrl: SafeUrl | null = null;
  audioFile: IRecordedAudioOutput | null = null;

  constructor(
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    private audioRecoverService: AudioRecoverService
  ) {
    this.audioRecoverService.recordingFailed().subscribe((error) => {
      console.log('falhou: ', error);

      this.isRecording = false;
    });

    // this.audioRecoverService
    //   .getRecordedTime()
    //   .subscribe((time) => (this.recordedTime = time));

    this.audioRecoverService.getRecordedBlob().subscribe((data) => {
      console.log('voltou: ', data);

      this.audioFile = data;

      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      console.log('voltou: ', data);

      this.audioFile = data;

      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
    });
  }

  startRecording() {
    // if (!this.isRecording) {
    //   this.isRecording = true;
    //   this.audioRecordingService.startRecording();
    // }

    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecoverService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    // if (this.isRecording) {
    //   this.audioRecordingService.stopRecording();
    // this.isRecording = false;
    // }

    if (this.isRecording) {
      this.audioRecoverService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  download(): void {
    if (!this.audioFile) return;

    const url = window.URL.createObjectURL(this.audioFile.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.audioFile.title;
    link.click();
  }
}
