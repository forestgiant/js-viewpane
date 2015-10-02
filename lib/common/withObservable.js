"use strict";

function withObservable() {
	this.addObserver = addObserver;
	this.removeObserver = removeObserver;
	this.notify = notify;
	this.__observables = {};
	// this.__initObservable = function initObservable(self) {
	// 	self.observables = {};
	// 	self.__initObservable = Function.prototype;
	// }
	return this;
}

function addObserver(eventName, callback) {
	// this.__initObservable(this);
	this.__observables[eventName] = this.__observables[eventName] || [];
	var observers = this.__observables[eventName];
	if (observers.indexOf(callback) < 0) {
		observers.push(callback);
	}
}

function removeObserver(eventName, callback) {
	if (this.__observables[eventName] == null) {
		return;
	}

	var index = this.__observables[eventName].indexOf(callback);
	if (index >= 0) {
		this.__observables[eventName].splice(index, 1);
	}
}

function notify(eventName) {
	// this.__initObservable(this);
	var observers = this.__observables[eventName];
	if (observers == null || observers.length === 0) {
		return;
	}

	var args = Array.prototype.slice.call(arguments, 1);
	for (var i = 0, l = observers.length; i < l; i += 1) {
		observers[i].apply(null, args);
	}
}

module.exports = withObservable;
