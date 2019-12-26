// console.log('waveform loaded');

var app = app || {};
app.init = init;
app.animate = animate;
app.play = true;

var scene, camera, renderer,
    mouseX = 0, mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    graphics, SIZE, HALF_SIZE;

function init() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 60;
    SIZE = analyser.fftSize;
    HALF_SIZE  = SIZE / 2;
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 3000);
    // camera.position.set(0, -450, 700);

    renderer.setClearColor(0x000000, 1);
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    graphics = new Graphics();
    document.body.appendChild( graphics.dom );

    var PI2 = Math.PI * 2;
    particles = new Array();

    for (var j = 0; j <= SIZE; j++) {
        var material = new THREE.SpriteCanvasMaterial({
            color: 0xffffff, program: function (context) {
                context.beginPath();
                //somehow those params make it not draw weird lines on the page
                context.arc(0, 1, 1, 0, PI2, true);
                context.fill();
            }
        });

        var particle = particles[j++] = new THREE.Particle(material);
        setPositionForWaveForm(particle,j,0);
        particle.position.y = 0;
        scene.add(particle);
    }

    camera.position.y = settings.cameraY - 450;
    camera.position.z = settings.cameraZ + 700; t

    particlesLines1 = new Array();


    for (var i = 0; i <= HALF_SIZE; i++) {
        var material = new THREE.SpriteCanvasMaterial({
            color: 0xffffff, program: function (context) {
                context.beginPath();
                context.arc(0, -1, 1, 0, PI2, true);
                context.fill();
            }
        });
        var particle = particlesLines1[ i ++ ] = new THREE.Particle(material);
        setPositionForLines2(particle,i,1,0);
    }
    particlesLines2 = new Array();
    for (var j = 0; j <= SIZE; j++) {

        var material2 = new THREE.SpriteCanvasMaterial({
            color: 0xffffff, program: function (context2) {
                context2.beginPath();
                context2.arc(0, 0, 1, 0, PI2, true);
                context2.fill();
            }
        });
        var particle2 = particlesLines2[ j ++ ] = new THREE.Particle(material2);
        setPositionForLines2(particle2,j,2,0);
    }

    particlesLines3 = new Array();
    for (var k = 0; k <= HALF_SIZE; k++) {

        var material3 = new THREE.SpriteCanvasMaterial({
            color: 0xffffff, program: function (context3) {
                context3.beginPath();
                context3.arc(0, 1, 1, 0, PI2, true);
                context3.fill();
            }
        });
        var particle3 = particlesLines3[ k ++ ] = new THREE.Particle(material3);
        setPositionForLines2(particle3,k,3,0);
    }



    function onKeyDown(e) {
        switch (e.which) {
            case 13:
                camera.position.set(0, 0, 175);
                controls.reset();
                break;

            case 32:
                if (app.play) {
                    app.audio.pause();
                    app.play = false;
                } else {
                    app.audio.play();
                    app.play = true;
                }
                break;
            case 38:
                camera.position.z -= 1;
                break;
            case 40:
                camera.position.z += 1;
                break;

            case 37:
                //camera.rotation.y -= 2;
                break;

            case 39:
                //camera.rotation.y += 2;
                break;
            case 49:
                lines1Activated();
                break;
            case 50:
                lines2Activated();
                break;
            case 83:
                if (controls.autoRotate) {
                    controls.autoRotate = false;
                }
                else {
                    controls.autoRotate = true;
                }
                break;
            case 67:
                if (gui.closed){
                    gui.closed = false;
                }
                else {
                    gui.closed = true;
                }
                break;
            case 187:
                if (settings.intensity < 4) {
                    settings.intensity += 0.25;
                }
                break;
            case 189:
                if(settings.intensity > 0.1){
                    settings.intensity -= 0.25;
                }
                break;
            case 66:
                controls.reset();

        }
        return false;
    }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    window.addEventListener("keydown", onKeyDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

}

var GuiControls = function(){
    this.intensity = 1;
    this.color1 = 0xCD0000;
    this.color2 = 0xFF8000;
    this.color3 = 0xFFFF1a;
    this.color4 = 0x009900;
    this.color5 = 0x00CCCC;
    this.color6 = 0x3333FF;
    this.color7 = 0xEE00EE;
    this.color8 = 0xCD3278;
    this.line1Color = 0xFFFFFF;
    this.line2Color = 0x1eff;
    this.line3Color = 0xFF0000;
    this.isLines1 = true;
    this.isLines2 = false;
    this.changeR = false;
    this.changeG = true;
    this.changeB = false;
    // this.cameraX = 0;
    this.cameraY = 0;
    this.cameraZ = 0;
    this.particleHeight = 0;
};

var settings = new GuiControls();
var gui = new dat.GUI();
gui.closed = true;


gui.add(settings, 'isLines1').name('Тип 1').listen().onChange(lines1Activated);

gui.add(settings, 'isLines2').name('Тип 2').listen().onChange(lines2Activated);

var lines1Folder = gui.addFolder('Линии 1');
lines1Folder.addColor(settings, 'color1').name('Color 1');
lines1Folder.addColor(settings, 'color2').name('Color 2');
lines1Folder.addColor(settings, 'color3').name('Color 3');
lines1Folder.addColor(settings, 'color4').name('Color 4');
lines1Folder.addColor(settings, 'color5').name('Color 5');
lines1Folder.addColor(settings, 'color6').name('Color 6');
lines1Folder.addColor(settings, 'color7').name('Color 7');
lines1Folder.addColor(settings, 'color8').name('Color 8');
lines1Folder.add(settings, 'intensity', 0.5, 4).step(0.5).name('Интенсивность');
//lines1Folder.add(settings, 'particleHeight', -500, 500);

lines1Folder.open();

var lines2Folder = gui.addFolder('Линии 2');
lines2Folder.addColor(settings, 'line1Color').name('Верхняя линия');
lines2Folder.addColor(settings, 'line2Color').name('Средняя линия');
lines2Folder.addColor(settings, 'line3Color').name('Нижняя линия');
gui.add(settings, 'changeR').name('Менять R канал');
gui.add(settings, 'changeG').name('Менять G канал');
gui.add(settings, 'changeB').name('Менять B канал');
//lines2Folder.addColor(settings, 'line2Color1').name('Color 1');
//lines2Folder.add(settings, 'line2Intensity', 0.5, 4).step(0.5);
// gui.add(waveform, 'cameraX', -500, 500);
//lines1Folder.add(waveform, 'cameraY', -560, 1000);
//lines1Folder.add(waveform, 'cameraZ', 0, 1000);

function animate() {
    app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
    stats.begin();
    var uintFrequencyData = new Uint8Array(analyser.frequencyBinCount);
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeFrequencyData);
    analyser.getByteFrequencyData(uintFrequencyData);
    graphics.draw(settings);
    if(settings.isLines1){
        for (var j = 0; j <= SIZE; j++){
            particle = particles[j++];
            setPositionForWaveForm(particle,j,timeFrequencyData[j]);
        }


    }else{
        for (var i = 0; i <= HALF_SIZE; i++){
            particle = particlesLines1[i++];
            particle3 = particlesLines3[i-1];
            setPositionForLines2(particle,i,1,uintFrequencyData[i]);
            setPositionForLines2(particle3,i,3,uintFrequencyData[i]);
        }
        for (var j = 0; j <= 2048; j++){
            particle2 = particlesLines2[j++];
            setPositionForLines2(particle2,j,2,timeFrequencyData[j]);

        }

    }


    renderer.render(scene, camera);
    camera.lookAt(scene.position);
    stats.end()
}

function setPositionForWaveForm(particle, j, frequency) {
    var particlePositionZ = -175;
    var particleSpacing = 3;
    var particleOffset = 0;
    var particleHeight = 0;
    if (settings.intensity === 4){
        particleHeight = 209;
    }
    else if (settings.intensity === 3.5){
        particleHeight = 145;
    }
    else if (settings.intensity === 3){
        particleHeight = 80;
    }
    else if (settings.intensity === 2.5){
        particleHeight = 16;
    }
    else if (settings.intensity === 2){
        particleHeight = -48;
    }
    else if (settings.intensity === 1.5){
        particleHeight = -111;
    }
    else if (settings.intensity === 1){
        particleHeight = -175;
    }
    else if (settings.intensity === 0.5){
        particleHeight = -239;
    }
    var STEP = (SIZE / 8) >> 0;
    var k = ( j / STEP >> 0);
    particle.position.x = (j - STEP/2 - STEP * k - particleOffset) * (particleSpacing);

    particle.position.y = (frequency * settings.intensity  - (particleHeight + 75*k));

    //console.log(particle.position.y);
    particle.position.z = particlePositionZ + 50 * k;
    switch (k) {
        case 0:
            particle.material.color.setHex(settings.color1);
            break;
        case 1:
            particle.material.color.setHex(settings.color2);
            break;

        case 2:
            particle.material.color.setHex(settings.color3);
            break;

        case 3:
            particle.material.color.setHex(settings.color4);
            break;

        case 4:
            particle.material.color.setHex(settings.color5);
            break;

        case 5:
            particle.material.color.setHex(settings.color6);
            break;

        case 6:
            particle.material.color.setHex(settings.color7);
            break;

        case 7:
            particle.material.color.setHex(settings.color8);
            break;
    }
}

function setPositionForLines2(particle, j, lvl, frequency) {
    if(lvl === 1){
        if (j <= 1024){
            particle.position.x = (j - 512) * 1.1;
            //particle.position.y = 0;
            particle.position.z = 0;
            particle.position.y = (frequency + 80);
            particle.material.color.setHex(settings.line1Color);
            if(settings.changeR)
                particle.material.color.r = Math.abs(particle.material.color.r - frequency/255);
            if(settings.changeG)
                particle.material.color.g = Math.abs(particle.material.color.g - frequency/255);
            if(settings.changeB)
                particle.material.color.b = Math.abs(particle.material.color.b - frequency/255);

        }
    }else if(lvl === 2){
        if (j <= 1024){
            particle.position.x = (j - 512) * 1.1;
            //particle2.position.y = 0;
            particle.position.z = 0;

        }
        if (j > 1024){
            particle.position.x = (j - 1536) * 1.1;
            //particle2.position.y = 0;
            particle.position.z = 0;

        }
        particle.position.y = (frequency/1.5 - 85);
        particle.material.color.setHex(settings.line2Color);
        if(settings.changeR)
            particle.material.color.r = Math.abs(particle.material.color.r - frequency/375);
        if(settings.changeG)
            particle.material.color.g = Math.abs(particle.material.color.g - frequency/375);
        if(settings.changeB)
            particle.material.color.b = Math.abs(particle.material.color.b - frequency/375);
    }else if(lvl === 3){
        if (j <= 1024){
            particle.position.x = -(j - 512) * 1.1;
            //particle3.position.y = 0;
            particle.position.z = 0;

            particle.position.y = -(frequency + 80);
            particle.material.color.setHex(settings.line3Color);
            if(settings.changeR)
                particle.material.color.r = Math.abs(particle.material.color.r - frequency/255);
            if(settings.changeG)
                particle.material.color.g = Math.abs(particle.material.color.g - frequency/255);
            if(settings.changeB)
                particle.material.color.b = Math.abs(particle.material.color.b - frequency/255);

        }
    }
}

function lines1Activated(){
    settings.isLines1 = true;
    settings.isLines2 = false;
    lines1Folder.open();
    lines2Folder.close();
    console.log('isLines1');
    for(var i = 0; i <= SIZE; i += 2){
        scene.add(particles[i]);
        scene.remove(particlesLines2[i]);
        if(i <= 1024){
            scene.remove(particlesLines1[i]);
            scene.remove(particlesLines3[i]);
        }
    }
    camera.position.y = settings.cameraY - 450;
    camera.position.z = settings.cameraZ + 700;
}

function lines2Activated(){
    settings.isLines1 = false;
    settings.isLines2 = true;
    lines1Folder.close();
    lines2Folder.open();
    console.log('isLines2');
    for(var i = 0; i <= SIZE; i += 2){
        scene.remove(particles[i]);
        scene.add(particlesLines2[i]);
        if(i <= 1024){
            scene.add(particlesLines1[i]);
            scene.add(particlesLines3[i]);
        }
    }
    camera.position.set(0, -50, 750);
}