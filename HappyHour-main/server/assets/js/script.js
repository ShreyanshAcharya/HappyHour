var MODEL_LOADED = false;

const video = document.getElementById( 'local' );
window.happiness = [];

Promise.all( [
	faceapi.nets.tinyFaceDetector.loadFromUri( '/models' ),
	faceapi.nets.faceLandmark68Net.loadFromUri( '/models' ),
	faceapi.nets.faceRecognitionNet.loadFromUri( '/models' ),
	faceapi.nets.faceExpressionNet.loadFromUri( '/models' ),
] ).then( () => {
	MODEL_LOADED = true;
} );

video.addEventListener( 'playing', () => {
	if ( MODEL_LOADED ) {
		const canvas = faceapi.createCanvasFromMedia( video );
		document.body.append( canvas );
		const displaySize = {
			width: 266,
			height: 200,
		};
		faceapi.matchDimensions( canvas, displaySize );
		setInterval( async () => {
			const detections = await faceapi
				.detectAllFaces( video, new faceapi.TinyFaceDetectorOptions() )
				.withFaceLandmarks()
				.withFaceExpressions();
			if ( detections[ 0 ]?.expressions?.happy ) {
				window.happiness.push( detections[ 0 ]?.expressions?.happy );
			}
			const resizedDetections = faceapi.resizeResults( detections, displaySize );
			canvas.getContext( '2d' ).clearRect( 0, 0, 266, 200 );
			faceapi.draw.drawDetections( canvas, resizedDetections );
			faceapi.draw.drawFaceLandmarks( canvas, resizedDetections );
			faceapi.draw.drawFaceExpressions( canvas, resizedDetections );
		}, 1000 );
	}
} );
