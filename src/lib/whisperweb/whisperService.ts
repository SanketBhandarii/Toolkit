import { pipeline } from '@xenova/transformers';

export class WhisperService {
  private model: any = null;

  async initialize() {
    if (!this.model) {
      this.model = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    }
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    await this.initialize();
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);
    
    const result = await this.model(audioData, {
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: false,
    });
    
    return result.text;
  }
} 