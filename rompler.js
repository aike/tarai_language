/*
 * rompler.js
 *
 * This program is licensed under the MIT License.
 * Copyright 2013, aike (@aike1000)
 *
 */

/////////////////////////////////////////////////////
var SampleBuffer = function(ctx, url, callback) {
	this.ctx = ctx;
	this.url = url;
	this.onload = callback;
	this.buffer = null;
};

SampleBuffer.prototype.loadBuffer = function(callback) {
	var request = new XMLHttpRequest();
	request.open("GET", this.url, true);
	request.responseType = "arraybuffer";

	var self = this;
	request.onload = function() {
		self.ctx.decodeAudioData(
			request.response,
			function(buffer) {
				if (!buffer) {
					console.log('error decode buffer: ' + self.url);
					return;
				}
				self.buffer = buffer;
				if (callback) {
					callback(self.buffer.getChannelData(0));
				}
			},
			function() {
				console.log('error decoding process: ' + self.url);
				return;
			}
		);
	}
	request.onerror = function() {
		alert('BufferLoader: XHR error');
	}

	request.send();
}

/////////////////////////////////////////////////////
var Rompler = function (ctx, url) {
	this.ctx = ctx;
	this.sample = new SampleBuffer(this.ctx, url);
	this.sample.loadBuffer();
	this.next_node = null;
};

Rompler.prototype.connect = function(next_node) {
	this.next_node = next_node;
};

Rompler.prototype.noteOn = function() {
	this.src = this.ctx.createBufferSource();
	if (this.sample.buffer != null) {
		this.src.buffer = this.sample.buffer;
		this.src.connect(this.next_node);
		this.src.start(0);
	}
};

Rompler.prototype.noteOff = function() {
	this.src.stop(0);
};

