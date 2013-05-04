/*
 * tarai_language.js
 *
 * This program is licensed under the MIT License.
 * Copyright 2013, aike (@aike1000)
 *
 */

function Stack() {
    this.data = [];
}
Stack.prototype.push = function (val) {
    this.data.push(val);
    return val;
}
Stack.prototype.pop = function () {
    return this.data.pop();
}
Stack.prototype.empty = function () {
    return this.data.length == 0;
}

///////////

function Interpreter() {
	this.pc = null;
	this.clock = null;
	this.stack = null;
	this.jumptable = {};
	this.vars = null;
	this.count = 0;
	this.running = false;
	this.pause = false;
	this.reset = false;
	this.script = null;
	this.wait = 1800;
}

Interpreter.prototype.run = function(script) {
	this.script = script;
	this.initJumptable();
	this.initEnvironment();
	player.setTempo(this.wait);
	$('#proc').css('display', 'block');
	this.reset = false;
	this.running = true;
	var self = this;
	setTimeout(function() {self.eval();}, self.clock);
}

Interpreter.prototype.initJumptable = function() {
	for (var i = 0; i < this.script.length; i++) {
		var a = this.script[i].split(' ');
		if (a[0] === 'def') {
			this.jumptable[a[1]] = i;
		}
	}
}

Interpreter.prototype.initEnvironment = function() {
	this.pc = 0;
	this.clock = 0;
	this.stack = new Stack();
	this.vars = {};
	this.count = 0;
	this.running = false;
	this.pause = false;

	this.vars['a1'] = 0;
	this.vars['a2'] = 0;
	this.vars['a3'] = 0;
	this.vars['ret'] = 0;
	this.vars['v1'] = 0;
	this.vars['v2'] = 0;
	this.vars['v3'] = 0;
	this.vars['v4'] = 0;

	$('#count').text(this.count);
	$('#calcx').text('');
	$('#calcy').text('');
	$('#calcz').text('');
}

Interpreter.prototype.evalvar = function(atom) {
	return (atom.match(/^-?[0-9]+$/)) ? parseInt(atom, 10) : parseInt(this.vars[atom], 10);
}

Interpreter.prototype.eval = function() {
	var self = this;

	// pause
	if (this.pause) {
		setTimeout(function() {self.eval();}, 100);
		return;
	}

	// terminate program
	if (this.reset || (this.script[this.pc] === null) || (this.script[this.pc] === 'end')) {
		this.running = false;
		$('#proc').css('display', 'none');
		if (this.reset) {
			this.reset = false;
			this.initEnvironment();
		}
		return;
	}

	// split command line
	var args = this.script[this.pc].replace(/^[ 	]+/, '').replace(/#.*/, '').split(/[ 	]+/);
	var cmd = args[0];
	if (args[1] === '=') {
		cmd = args[1];
	}
	if (args.length == 1) {
		cmd = 'blank';
	}

	var w1, w2, w3;

	this.clock = 0;
	switch (cmd) {
		case 'blank':
			this.pc += 1;
			break;

		case 'play':
			this.clock = this.wait * 990 / 1000;	// latency adjustment (99%)
			this.pc += 1;
			player.play(
				this.evalvar(args[1]),
				this.evalvar(args[2]),
				this.evalvar(args[3]));
			break;

		case '=':
			if (args.length > 4) {
				w1 = this.evalvar(args[2]);
				w2 = this.evalvar(args[4]);
				switch (args[3]) {
					case '+':
						this.vars[args[0]] = w1 + w2;
						break;
					case '-':
						this.vars[args[0]] = w1 - w2;
						break;
					case '*':
						this.vars[args[0]] = w1 * w2;
						break;
					case '/':
						this.vars[args[0]] = Math.floor(w1 / w2);
						break;
					default:
						console.log('error (' + this.pc + '): ' + this.script[this.pc]);
						this.reset = true;
				}
			} else {
				this.vars[args[0]] = w1;
			}
			this.pc += 1;
			break;

		case 'if':
			w1 = this.evalvar(args[1]);
			w2 = this.evalvar(args[3]);
			if (((args[2] === '==') && (w1 == w2))
			 || ((args[2] === '!=') && (w1 != w2))
			 || ((args[2] === '<=') && (w1 <= w2))
			 || ((args[2] === '>=') && (w1 >= w2))
			 || ((args[2] === '<')  && (w1 <  w2))
			 || ((args[2] === '>')  && (w1 >  w2))) {
				this.pc += 1;
			} else {
				this.pc += 2;
			}
			break;

		case 'def':
			this.pc += 1;
			break;

		case 'defend':
			this.pc += 1;
			break;

		case 'call':
			// save variables
			this.stack.push(this.vars['v1']);
			this.stack.push(this.vars['v2']);
			this.stack.push(this.vars['v3']);
			this.stack.push(this.vars['v4']);
			this.stack.push(this.vars['a1']);
			this.stack.push(this.vars['a2']);
			this.stack.push(this.vars['a3']);

			// set arguments
			w1 = this.evalvar(args[2]);
			w2 = this.evalvar(args[3]);
			w3 = this.evalvar(args[4]);
			this.vars['a1'] = w1;
			this.vars['a2'] = w2;
			this.vars['a3'] = w3;

			// show arguments
			this.count += 1;
			$('#count').text(this.count);
			$('#calcx').text(w1);
			$('#calcy').text(w2);
			$('#calcz').text(w3);

			// init local variables
			this.vars['ret'] = 0;
			this.vars['v1'] = 0;
			this.vars['v2'] = 0;
			this.vars['v3'] = 0;
			this.vars['v4'] = 0;

			// set return address
			this.stack.push(this.pc + 1);

			// jump to function's address
			this.pc = this.jumptable[args[1]];
			break;

		case 'return':
			// set return value
			this.stack.push(this.evalvar(args[1]]));

			// get return value
			this.vars['ret'] = this.stack.pop();
			// pop return address
			this.pc = this.stack.pop();
			// pop variables
			this.vars['a3'] = this.stack.pop();
			this.vars['a2'] = this.stack.pop();
			this.vars['a1'] = this.stack.pop();
			this.vars['v4'] = this.stack.pop();
			this.vars['v3'] = this.stack.pop();
			this.vars['v2'] = this.stack.pop();
			this.vars['v1'] = this.stack.pop();
			break;

		default:
			console.log('error (' + this.pc + '): ' + this.script[this.pc]);
			this.reset = true;
	}

	setTimeout(function() {self.eval();}, self.clock);
}

Interpreter.prototype.onStart = function() {
	if (!this.running) {
		var s = [];
		for (var i = 0, l = script.length; i < l; i++) {
			s[i] = script[i]
				.replace('{x}', $('#argx').val())
				.replace('{y}', $('#argy').val())
				.replace('{z}', $('#argz').val());
		}
		player.mute = false;
		this.run(s);
	} else {
		this.pause = !this.pause;
		player.mute = !player.mute;
	}
}

Interpreter.prototype.onReset = function() {
	this.reset = true;
	this.pause = false;
	this.initEnvironment();
	player.mute = true;
}


////////////////////////////////////////////////////
var script = [
	'#----------------------',
	'# tarai function script',
	'#----------------------',
	'call tarai {x} {y} {z}',
	'end',
	'',
	'def tarai',
	'	play a1 a2 a3',
	'	if a1 <= a2',
	'		return a2',
	'	v1 = a1 - 1',
	'	call tarai v1 a2 a3',
	'	v2 = ret',
	'	v1 = a2 - 1',
	'	call tarai v1 a3 a1',
	'	v3 = ret',
	'	v1 = a3 - 1',
	'	call tarai v1 a1 a2',
	'	v4 = ret',
	'	call tarai v2 v3 v4',
	'	return ret',
	'defend'
];

var player = new Player();
var taraiMachine = new Interpreter();

