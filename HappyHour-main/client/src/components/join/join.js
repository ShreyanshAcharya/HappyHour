import './join.css';
function Join () {

	const { REACT_APP_SERVER_URL } = process.env;

	return <div>
		<div class="shows">
			<br/><h2>LIVE SHOWS </h2><br/><br/>
			<div class="show1">
				<h4>Name: Demo Show</h4>
				<p>
					<h5> Venue: Online </h5>
					May 12 2022	Thursday	1:30pm
				</p>
				<div class="join-button">
					<button class="button-join" onClick={
						() => {
							window.location.href = REACT_APP_SERVER_URL + '/?room=Hello_3872500042';
						}
					}>Join</button>
				</div>

			</div>
			<div class="show1">
				<h4>Name: Zakir Khan</h4>
				<p>
					<h5> Venue: Online </h5>
					<div class="join-button">
					<button class="button-join" >Coming Soon</button>
				</div>
					
				</p>
				
				
			</div><br/>
		</div>
		
	</div>;


}

export default Join;