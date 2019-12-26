var Graphics = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:'+(window.innerHeight - 218)+';left:'+(window.innerWidth- 400)+';cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {
		for ( var i = 0; i < container.children.length; i ++ ) {
			container.children[ i ].style.display = i === id ? 'block' : 'none';
		}
		mode = id;
	}

	var firstPanel = addPanel( new Graphics.Panel( 'График 1' ) );
	var secondPanel = addPanel( new Graphics.Panel( 'График 2') );


	showPanel( 1 );
	function draw(spiral) {
		firstPanel.draw(spiral,1);
		secondPanel.draw(spiral,2);
	}
	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		draw: draw,

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Graphics.Panel = function ( name) {

	var round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 400 * PR, HEIGHT = 150 * PR,
			TEXT_X = (WIDTH/2 - name.length * 2) * PR, TEXT_Y = 2 * PR,
			GRAPH_WIDTH = (WIDTH - 10) * PR, GRAPH_HEIGHT = (HEIGHT - 10) * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:'+WIDTH+'px;height:'+HEIGHT+'px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';
	context.fillRect( 0, 0, WIDTH, HEIGHT );
	return {

		dom: canvas,

		draw: function ( spiral, typeNode ) {
			var barHeight, barWidth;
			var x = 0;
			var bufferLength = analyser.frequencyBinCount;
			var frequencyArray = new Uint8Array(bufferLength);
			var timeDomainArray = new Uint8Array(bufferLength);
			analyser.getByteFrequencyData(frequencyArray);
			analyser.getByteTimeDomainData(timeDomainArray);

			if(typeNode === 1){
				context.clearRect(0, 0, WIDTH, HEIGHT);
				context.fillStyle = '#0ff';
				context.fillText( name, TEXT_X, TEXT_Y );
				barWidth = (WIDTH / bufferLength);
				for(var i = 0; i < bufferLength; i++) {
					barHeight = (timeDomainArray[i]/2)*2;


					// canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
					context.fillStyle = 'rgba(248,248,255, ' + 1.0+')';
					//Consider shifting to lines and using lineCap for rounded edges.
					context.fillRect(x,HEIGHT/2-barHeight/2,barWidth,barHeight);


					// x += barWidth +1;
					x += 1;
				}
			}else if (typeNode === 2){
				context.clearRect(0, 0, WIDTH, HEIGHT);
				context.fillStyle = '#0ff';
				context.fillText( name, TEXT_X, TEXT_Y );
				barWidth = (WIDTH / bufferLength)*10;
				for(var i = 0; i < bufferLength; i++) {
					barHeight = frequencyArray[i] - 100;
					context.beginPath();
					context.moveTo(x,HEIGHT);
					context.lineTo(x,HEIGHT-barHeight);
					context.lineWidth = barWidth;
					context.lineCap = 'round';
					//context.strokeStyle = '#fff';
					//console.log(R + ' '+ G + ' ' + B);
					context.strokeStyle = 'rgba('+ (frequencyArray[i] - 100) +','+  (frequencyArray[i] - 100) +','+ (frequencyArray[i] - 100)+', ' + 1.0+')';
					context.stroke();

					x += barWidth + barWidth / 2;
				}
			}
		}

	};

};
