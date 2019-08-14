/** @format */

let start;
let ticking = false;

function throttle() {
	//Are we ticking? No? You gon learn!
	!ticking && requestAnimationFrame(step);
	//after request is put in above, let the program know not to call it again until the request is handled
	ticking = true;
}

function step(timestamp) {
	//Set start variable to first timestamp value (timestamp tracks amount of time since first function call)
	if (!start) {
		start = timestamp;
	}
	//if time from first timestamp to current timestamp is more than 100 ms, then do the thing!
	if (timestamp - start > 100) {
		//do the thing
		leftCount.innerHTML = Number(leftCount.innerHTML) + 1;
		//make start falsey so step's first if-statement resets it
		start = null;

		console.log(timestamp);

		//cancelAnimationFrame(x);
	}
	//we're done here! step can be requested again via rAF
	ticking = false;
}
