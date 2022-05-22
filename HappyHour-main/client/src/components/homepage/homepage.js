import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './homepage.css';

const api_key = 'AIzaSyDQmZgn1ZYJNblexWz6kxAxygVS4yahVmQ';
const video_http = 'https://www.googleapis.com/youtube/v3/videos?';

const Homepage = ({updateUser}) => {
	const [ data, setData ] = useState( null );
	const [ rating, setRating ] = useState( null );
	const history = useHistory();

	const { REACT_APP_SERVER_URL } = process.env;

	useEffect( () => {
		const fetchData = () => {
			fetch(
				video_http +
				new URLSearchParams( {
					key: api_key,
					part: 'snippet',
					chart: 'mostPopular',
					maxResults: 50,
					regionCode: 'IN',
				} )
			)
				.then( ( res ) => res.json() )
				.then( ( data ) => {
					setData( data );
				} )
				.catch( ( err ) => console.log( err ) );
		};

		const getRating = async () => {
			const rating = await axios.get( `${ REACT_APP_SERVER_URL }/get-rating` );

			if ( rating.data ) {
				setRating( rating.data.rating );
			}
		};

		fetchData();
		getRating();
	}, [ REACT_APP_SERVER_URL ] );

	function loadScript ( src ) {
		return new Promise( ( resolve ) => {
			const script = document.createElement( "script" );
			script.src = src;
			script.onload = () => {
				resolve( true );
			};
			script.onerror = () => {
				resolve( false );
			};
			document.body.appendChild( script );
		} );
	}

	async function displayRazorpay () {
		const res = await loadScript(
			"https://checkout.razorpay.com/v1/checkout.js"
		);

		if ( !res ) {
			alert( "Razorpay SDK failed to load. Are you online?" );
			return;
		}

		const result = await axios.post( `${ REACT_APP_SERVER_URL }/payment/orders` );

		if ( !result ) {
			alert( "Server error. Are you online?" );
			return;
		}

		console.log( result.data );

		const { amount, id: order_id, currency } = result.data;

		const options = {
			key: "rzp_test_jwqKmnDu9OrIPQ", // Enter the Key ID generated from the Dashboard
			amount: amount.toString(),
			currency: currency,
			name: "Happy Hour.",
			description: "Test Transaction",
			image: '/assets/img/logo.PNG',
			order_id: order_id,
			handler: async function ( response ) {
				const data = {
					orderCreationId: order_id,
					razorpayPaymentId: response.razorpay_payment_id,
					razorpayOrderId: response.razorpay_order_id,
					razorpaySignature: response.razorpay_signature,
				};

				const result = await axios.post( `${ REACT_APP_SERVER_URL }/payment/success`, data );

				if ( result?.data?.success ) {
					history.push( '/join' );
				}
			},
			prefill: {
				name: "Shreyansh Acharya",
				email: "shreyanshacharya09@gmail.com",
				contact: "7060472773",
			},
			notes: {
				address: "My address",
			},
			theme: {
				color: "#61dafb",
			},
		};

		const paymentObject = new window.Razorpay( options );
		paymentObject.open();
	}

	console.log( data );

	return (
		<div>
			<nav class="navbar">
				<div class="toggle-btn">
					<span />
					<span />
					<span />
				</div>
				<img src="assets/img/logo.PNG" class="logo" alt="" />
				<div class="search-box">
					<input type="text" class="search-bar" placeholder="search" />
					<button class="search-btn">
						<img src="assets/img/search.PNG" alt="" />
					</button>
				</div>
				<div class="user-options">
					<button class="ticket" onClick={ displayRazorpay }>
						<img
							src="assets/img/ticket.PNG"
							height="60px"
							width="120px"
							alt=""
						/>
					</button>
					<img src="assets/img/video.PNG" class="icon" alt="" />
					<img src="assets/img/grid.PNG" class="icon" alt="" />
					<img src="assets/img/bell.PNG" class="icon" alt="" />
					
					<div className="logout" onClick={() => updateUser({})} >Logout</div>
				</div>
			</nav>

			{/* <!-- sidebar --> */ }
			<div class="side-bar">
				{ rating && <div class="links">
					Previous Show Rating: <span>{ Math.round( ( rating * 100 ) / 20 ).toFixed( 2 ) }</span>
				</div> }
				<a href="/" class="links active">
					<img src="assets/img/home.PNG" alt="" />
					home
				</a>
				<a href="/" class="links">
					<img src="assets/img/explore.PNG" alt="" />
					explore
				</a>
				<a href="/" class="links">
					<img src="assets/img/subscription.PNG" alt="" />
					subscription
				</a>
				<hr class="seperator" />
				<a href="/" class="links">
					<img src="assets/img/library.PNG" alt="" />
					library
				</a>
				<a href="/" class="links">
					<img src="assets/img/history.PNG" alt="" />
					history
				</a>
				<a href="/" class="links">
					<img src="assets/img/your-video.PNG" alt="" />
					your video
				</a>
				<a href="/" class="links">
					<img src="assets/img/watch-later.PNG" alt="" />
					watch later
				</a>
				<a href="/" class="links">
					<img src="assets/img/liked video.PNG" alt="" />
					like video
				</a>
				<a href="/" class="links">
					<img src="assets/img/show more.PNG" alt="" />
					show more
				</a>
			</div>

			{/* <!-- filters --> */ }
			<div class="filters">
				<button class="filter-options active">all</button>
				
				<a class="filter-options" href="https://www.youtube.com/c/ZakirKhan/videos">Zakir Khan</a>
				<a class="filter-options" href="https://www.youtube.com/c/AnubhavSinghBassi/videos">Anubhav Singh Bassi</a>
				<a class="filter-options" href="https://www.youtube.com/user/knngill/videos">Kannan Gill</a>
				<a class="filter-options" href="https://www.youtube.com/c/KennySebastian/videos">Kenny Sebastian</a>
				<a class="filter-options" href="https://www.youtube.com/c/LouisCKonYouTube/videos">Louis C.K.</a>
				<a class="filter-options" href="https://www.youtube.com/virdas/videos">Vir Das</a>
				<a class="filter-options" href="https://www.youtube.com/channel/UCW24Wt4EgHpuktSW6XAnt2g/videos">Rohan Joshi</a>
				<a class="filter-options" href="https://www.youtube.com/c/TanmayBhatYouTube/videos">Tanmay Bhat</a>
				
				<button class="filter-options">Gaurav Kapoor</button>
			</div>

			{/* <!-- videos --> */ }
			<div class="video-container">
				{ data
					? data?.items?.map( ( e, index ) => {
						return (
							<div
								class="video"
								style={ { cursor: 'pointer' } }
								key={ index }
								onClick={ () =>
									window.open( `https://youtube.com/watch?v=${ e.id }`, '_blank' )
								}
							>
								<img
									src={ e.snippet.thumbnails.high.url }
									class="thumbnail"
									alt=""
								/>
								<div class="content">
									<img src={ e.channelThumbnail } class="channel-icon" alt="" />
									<div class="info">
										<h4 class="title">{ e.snippet.title }</h4>
										<p class="channel-name">{ e.snippet.channelTitle }</p>
									</div>
								</div>
							</div>
						);
					} )
					: null }
			</div>
		</div>
	);
};

export default Homepage;
