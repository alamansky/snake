/** @format */

let component = {
	updateState(newState, shouldRender = true) {
		let x = newState;
		for (var prop in this.state) {
			for (var newProp in x) {
				prop == newProp ? (this.state[prop] = x[newProp]) : null;
			}
		}
		shouldRender && this.render();

		return this;
	},
};

export { component };
