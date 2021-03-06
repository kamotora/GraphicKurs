var app = app || {};
var source;
var buffer;
var analyser;

window.onload = function () {

    // console.log('audio loader connected');

    //window.addEventListener('drop', onDrop, false);
    //window.addEventListener('dragover', onDrag, false);
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function() {
        $('#notification').velocity('fadeOut', { duration: 150 });
        initiateAudio(this.files[0]);
        return false;
    };

    function initiateAudio(data) {
        if(app.audio){
            app.audio.remove();
            window.cancelAnimationFrame(app.animationFrame);
        }
        app.audio = audio;
        app.audio.src = URL.createObjectURL(data); // sets the audio source to the dropped file
        app.audio.autoplay = true;
        app.audio.play();
        app.play = true;
        document.body.appendChild(app.audio);
        app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
        source = app.ctx.createMediaElementSource(app.audio); // creates audio source
        analyser = app.ctx.createAnalyser(); // creates analyserNode
        analyser.fftSize = 2048;
        source.connect(app.ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
        source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
        app.init();
        app.animate();
    }

    function onDrag(e) {
        e.stopPropagation();
        e.preventDefault();
        $('#notification').velocity('fadeOut', { duration: 150 });
        return false;
    }

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var droppedFiles = e.dataTransfer.files;
        initiateAudio(droppedFiles[0]); // initiates audio from the dropped file
    }

};

