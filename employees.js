/*
 	Here is a list of employee objects our
 	fake server call will return
*/

var fakeNames = [
	{ name: 'Bob' },
	{ name: 'Jim' },
	{ name: 'Sally' },
	{ name: 'Joe' },
	{ name: 'Jeff' },
	{ name: 'Sue' },
	{ name: 'Travis' },
	{ name: 'Chuck' },
	{ name: 'Paul' },
	{ name: 'Mandy' },
	{ name: 'Melissa' },
	{ name: 'Dan' },
	{ name: 'Zach' }
]

/*
	A helper to just grab some random employees and return them
*/
function moreEmployees() {
	// Grab a subset of names and return them
	var copy = fakeNames.slice();
	copy.splice(parseInt(Math.random() * fakeNames.length, 10));
	return copy;
}

/*
	Super generic "wannabe" ajax method
	to return an object the accepts
	a done() handler
*/
var ajax = {
	get: function() {
		return {
			done: function(fn) {
				fn(moreEmployees());
			}
		}
	}
}

/*
	An employee model 
	You can see that fromObject will populate the model
*/
Employee = function() {

	var self = this;

	this.name = ko.observable();

	this.fromObject = function(data) {
		self.name(data.name);
		return self;
	}

};

Employees = new (function() {

	var self = this;

	this.employees = ko.observableArray();

	this.update = function(data) {
		for (var i = 0; i < data.length; i++) {
			self.employees.push(
				// instantiate an employee with observable name
				new Employee().fromObject(data[i])
			);
		}
		/*
			In case the amount grows large because
			someone left their browser open on this
			example, clear out the names so their
			browser doesn't lock up. :D
		*/
		if (self.employees().length > 500) {
			self.employees.removeAll();
		}
	};

	/*
		As fake as it gets for server calls
		Make an "ajax" call and fetch some data
	*/
	this.fetch = function() {
		ajax.get().done(function(items) {
			self.update(items);
		});
	};

	/*
		Every 3 seconds, add some random
		employee names to the list from our
		super fake "ajax" call. Not intended
		to match up specifically to a jquery
		ajax call, just trying to demonstrate
		that we are calling a server, getting
		data, and adding it to an observable
		collection in knockout
	*/
	this.init = function() {
		ko.applyBindings(self, document.getElementById('employees'));
		self.fetch();
		setTimeout(function() {
			self.fetch();
		}, 3000);
	};

})();

/*
	When the DOM is loaded, we want to call ko.applyBindings
	for all of this to work. Included in the init function

	JQuery is not necessary, but makes it easier. And will
	likely be useful for ajax anyways -- hence why my
	fake server call is using jquery ajax-like syntax.
*/
$(document).ready(Employees.init);

/*
	If you want to try some fun things, try the following
*/
// Will update the name of the first employee, dom will change
function updateFirst(newName) {
	if (Employees.employees().length > 0) {
		Employees.employees()[0].name(newName);
	}
}

// Will remove the last employee that was added
function removeLast() {
	if (Employees.employees().length > 0) {
		Employees.employees.remove(
			Employees.employees()[
				Employees.employees().length - 1
			]
		);
	}
}