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