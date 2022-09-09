const socket = io("/");
const peer = new Peer(undefined, {
  host: location.hostname,
  port: location.port,
  path: "/peerjs",
});

socket.on("connection", () => {
  console.log("connected to server");
});

peer.on("open", function (id) {
  socket.emit("new-connection", peer.id);
  console.log("My peer ID is: " + id);
});

peer.on("connection", (connection) => {
  connection.on("data", (data) => {
    // console.log(data);
  });
  console.log("My peer ID is: " + id);
});

const container = document.querySelector(".container");
const videoBox = document.createElement("video");
videoBox.classList.add("video");
container.append(videoBox);

navigator.mediaDevices
  .getUserMedia({
    video: true,
    // audio: true,
  })
  .then((stream) => {
    videoBox.srcObject = stream;
    videoBox.addEventListener("loadedmetadata", () => {
      videoBox.play();
    });
    peer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", function (newStream) {
        const newVideo = document.createElement("video");
        videoBox.classList.add("video");
        newVideo.srcObject = newStream;
        newVideo.addEventListener("loadedmetadata", () => {
          newVideo.play();
        });
        container.append(newVideo);
      });
    });

    socket.on("new-user", (newPeerId) => {
      console.log("newPeerID", newPeerId);
      setTimeout(() => {
        const conn = peer.connect(newPeerId);
        conn.on("open", () => {
          const call = peer.call(newPeerId, stream);
          call.on("stream", (newStream) => {
            const newVideo = document.createElement("video");
            videoBox.classList.add("video");
            newVideo.srcObject = newStream;
            newVideo.addEventListener("loadedmetadata", () => {
              newVideo.play();
            });
            container.append(newVideo);
          });
        });
      }, 2000);
    });
  });
