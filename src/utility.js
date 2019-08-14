/** @format */

const a = {
	randomInt(maxInt) {
		//produces a random integer between 0 and maxInt
		return Math.floor(Math.random() * Math.floor(maxInt));
	},
	equalObjects(obj1, obj2) {
		//cheap and dirty object equality check, returns boolean
		return JSON.stringify(obj1) == JSON.stringify(obj2);
	},
	reduceObjects(obj1, obj2) {
		//add values of matching properties on two objects and return new object
		let x = {};
		for (var prop1 in obj1) {
			for (var prop2 in obj2) {
				if (prop1 == prop2) {
					x[prop1] = obj1[prop1] + obj2[prop2];
				}
			}
		}
		return x;
	},
	async getJSON(url, cb) {
		//takes a JSON url (to fetch) and a cb to handle data
		cb(await fetch(url).then((data) => data.json()));
	},
	getValue(selector) {
		return document.querySelector(selector).value;
	},
	arrDupes(arr) {
		return arr.length == new Set(arr).size;
	},
	removeDupes(arr) {
		return Array.from(new Set(arr));
	},

	/*eslint-disable*/

	logErr(error=null, message) {
		console.group('%c Attention:', 'color: red; font-weight: bold;');
		console.error(message);
		console.error(error); //if error is object, must have own console.error to be rendered properly
		error.name && console.log(error.name);
		error.message && console.log(error.message);
		error.stack && console.log(error.stack);
		console.groupEnd();
	},
	logVar(variable) {
		console.log(`variable '${Object.keys(variable)}' is equal to: ${Object.values(variable)}`);
	},

	/*eslint-enable*/

};

export { a };

//more helper function ideas?
