/*
 * player.js
 *
 * This program is licensed under the MIT License.
 * Copyright 2013, aike (@aike1000)
 *
 */

//////////////////////

Player = function() {
	this.beat = Math.floor(2000 / 16);
	this.notelen = Math.floor(this.beat * 4 * 7 / 8);
	this.notename  = ['D','E','F','G','A','B','C'];
	this.filename  = ['d','e','f','g','a','b','c1','d1','e1','f1','g1','a1','b1','c2','d2','e2','f2','g2','a2','b2','c'];
	this.notes = new Array(24);
	this.mute = false;

	this.ctx = new (window.AudioContext || window.webkitAudioContext)();

	for (var i = 0; i < this.filename.length; i++) {
		this.notes[i] = new Rompler(this.ctx, './wav/' + this.filename[i] + '.wav');
		this.notes[i].connect(this.ctx.destination);
	}
}

Player.prototype.setTempo = function(tempo) {
	this.beat = Math.floor(tempo / 16);
	this.notelen = Math.floor(this.beat * 4 * 7 / 8);
}

Player.prototype.playnote = function(note, timer) {
	var notenum = note % this.filename.length;
	var self = this;
	setTimeout(function() {
		if (!self.mute) {
			self.notes[notenum].noteOn()
			setTimeout(function() {self.notes[notenum].noteOff();}, self.notelen);
		}
	}, timer);
}

Player.prototype.play = function(n1, n2, n3) {
	if(this.ctx.state === 'suspended') {
		this.ctx.resume();
	}

	var a = [n1 + 1, n2 + 1, n3 + 1]
				.sort(function(a,b){
					if( a < b ) return -1;
					if( a > b ) return 1;
					return 0;
				});
	$('#note').text('(' + this.notename[(n1 + 1) % 7] + ', '
						+ this.notename[(n2 + 1) % 7] + ', '
						+ this.notename[(n3 + 1) % 7] + ')');
	this.playnote(a[0],     this.beat * 0);
	this.playnote(a[0] + 7, this.beat * 1);
	this.playnote(a[1],     this.beat * 2);
	this.playnote(a[1] + 7, this.beat * 3);
	this.playnote(a[2],     this.beat * 4);
	this.playnote(a[2] + 7, this.beat * 5);
	this.playnote(a[1],     this.beat * 6);
	this.playnote(a[1] + 7, this.beat * 7);

	this.playnote(a[0],     this.beat * 8);
	this.playnote(a[0] + 7, this.beat * 9);
	this.playnote(a[1],     this.beat * 10);
	this.playnote(a[1] + 7, this.beat * 11);
	this.playnote(a[2],     this.beat * 12);
	this.playnote(a[2] + 7, this.beat * 13);
	this.playnote(a[1],     this.beat * 14);
	this.playnote(a[1] + 7, this.beat * 15);
}
