function Start_Logic(){
    //Boot_Logic();
    start_front_Camera();
}

async function start_front_Camera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: 'environment',}
        });
    const videoElement = document.getElementById('Live_Background');
    videoElement.srcObject = stream;
    } catch (error) {
      console.error("Software Error", error);
    }
  }
function enterFullscreen() {
    const videoElement = document.documentElement; // The root HTML element

    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) { // Firefox
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { // IE/Edge
      videoElement.msRequestFullscreen();
    }
  }

  // Event listener for fullscreen button click
  document.getElementById('fullscreen-btn').addEventListener('click', enterFullscreen);
