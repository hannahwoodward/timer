export class Timer {
	constructor( opts ) {
		this.element = opts.element;
		this.interval = opts.interval;
		this.t0 = getNow();
		this.timeRemaining = opts.interval;
		this.timerId = null;
		this.interimTimerId = null;
		this.callbacks = {
			pause: [],
			play: [],
			ended: [],
			reset: []
		}

		const cb_names = [ 'pause', 'play', 'ended', 'reset' ];

		for ( let i = 0; i < cb_names.length; i++ ) {
			this.callbacks[cb_names[i]] = ( opts.callbacks[cb_names[i]] || [] );
		}

		this.element.addEventListener( 'click', () => {
			if ( this.element.classList.contains( 'timer--paused' ) ) {
				this.play();
				return;
			}
			this.pause();
		} );
	}

	clear() {
		window.clearInterval( this.timerId );
	}
	pause() {
		this.timeRemaining -= ( getNow() - this.t0 );
		clearTimeout( this.interimTimerId );
		this.clear();
		this.element.classList.add( 'timer--paused' );
		this.runCallbacks( 'pause' );
	}
	play() {
		this.element.classList.remove( 'timer--paused' );
		this.t0 = getNow();
		this.runCallbacks( 'play' );
		this.interimTimerId = setTimeout( () => {
			this.runCallbacks( 'ended' );
			this.timeRemaining = this.interval;
			this.reset();
		}, this.timeRemaining );
	}
	reset() {
		this.clear();
		this.t0 = getNow();
		this.runCallbacks( 'reset' );
		this.timerId = window.setInterval( () => {
			this.runCallbacks( 'ended' );
		}, this.interval );
	}
	runCallbacks( type ) {
		const cb = this.callbacks[type];
		if ( !cb.length ) return;
		for ( let i = 0; i < cb.length; i++ ) {
			cb[i]();
		}
	}
}

// Helpers

function getNow() {
	return performance.now();
}
