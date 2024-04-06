import { getSocket } from "../pages/Home";

interface NavigatorWithGetUserMedia extends Navigator {
  // @ts-ignore
  getUserMedia: Navigator["getUserMedia"];
  // @ts-ignore
  webkitGetUserMedia: Navigator["webkitGetUserMedia"];
  // @ts-ignore
  mozGetUserMedia: Navigator["mozGetUserMedia"];
}

declare let navigator: NavigatorWithGetUserMedia;

export const startAudioAnalysis = (): void => {
  let audioContext: AudioContext;
  let analyser: AnalyserNode;
  let microphone: MediaStreamAudioSourceNode;
  let javascriptNode: ScriptProcessorNode;

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: true },
      function(stream: MediaStream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        let max = 0;
        let blow = false;

        javascriptNode.onaudioprocess = function() {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;

          const length = array.length;
          for (let i = 0; i < length; i++) {
            values += array[i];
          }

          const average = values / length;

          if (Math.round(average - 40) > 65) {
            max = Math.round(average - 40);
            blow = true;
          } else {
            if (blow) {
              getSocket().emit("drop-candle", "")
              blow = false;
            }
          }
          if (blow) {
            console.log(max);
          }
        };
      },
      //@ts-ignore
      function(err: MediaStreamError) {
        console.log("The following error occurred: " + err.name);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }
}
