import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface IRecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class AudioRecoverService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  public isRecording = false;
  private _recorded = new Subject<IRecordedAudioOutput>();
  private _recordingFailed = new Subject<string>();

  getRecordedBlob(): Observable<IRecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  startRecording() {
    if (this.isRecording) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });

        console.log({ teste: this.mediaRecorder });

        this.audioChunks = [];

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          console.log('push: ', event.data);

          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, {
            type: 'audio/webm; codecs=opus',
          });

          const audioUrl = URL.createObjectURL(audioBlob);

          const audioName = encodeURIComponent(
            'audio_teste_' + new Date().getTime() + '.webm'
          );

          this._recorded.next({ blob: audioBlob, title: audioName });

          console.log('Áudio gravado:', audioUrl);
        });

        this.mediaRecorder.start();
      })
      .catch((error) => {
        console.log('falou...:', error);
        this._recordingFailed.next('Erro ao inicializar a gravação de áudio');
      });
  }

  stopRecording() {
    if (!this.mediaRecorder || !this.isRecording) return;

    this.isRecording = false;
    this.mediaRecorder.stop();
  }
}
