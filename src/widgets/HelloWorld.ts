import global from '@dojo/shim/global';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { FocusMixin } from '@dojo/widget-core/mixins/FocusMixin';
import { w, v } from '@dojo/widget-core/d';

import * as css from './styles/helloWorld.m.css';

export interface InputConfig {
	key: string;
	type: string;
}

export class RegistrationForm extends FocusMixin(WidgetBase) {

	private _currentInput: InputConfig;

	private _interval: number;

	private _inputs: InputConfig[] = [
		{
			key: 'firstName',
			type: 'element'
		},
		{
			key: 'lastName',
			type: 'element'
		},
		{
			key: 'email',
			type: 'element'
		},
		{
			key: 'password',
			type: 'widget'
		}
	];

	private _previous() {
		const keyIndex = this._inputs.indexOf(this._currentInput);
		if (keyIndex === 0) {
			this._currentInput = this._inputs[this._inputs.length - 1];
		}
		else {
			this._currentInput = this._inputs[keyIndex - 1];
		}
		this.focus();
	}
	private _next() {
		const keyIndex = this._inputs.indexOf(this._currentInput);
		if (keyIndex >= this._inputs.length - 1) {
			this._currentInput = this._inputs[0];
		}
		else {
			this._currentInput = this._inputs[keyIndex + 1];
		}
		this.focus();
	}

	private _play() {
		this._interval = global.setInterval(() => {
			this._next();
		}, 1000);
	}

	private _stop() {
		clearInterval(this._interval);
	}

	private _onfocus(input: any) {
		this._currentInput = input;
		this.invalidate();
	}

	private _renderInputs() {
		let autoFocus: any;
		if (!this._currentInput) {
			autoFocus = this._inputs[0];
			this._currentInput = autoFocus;
		}

		return this._inputs.map((input) => {
			const shouldAutoFocus = input === autoFocus;
			const shouldFocus = input === this._currentInput;
			const focus = shouldAutoFocus || shouldFocus && this.shouldFocus;

			return v('div', {
				classes: [ css.wrapper, !!focus ? css.focused : null ],
			}, [
				v('span', { classes: css.label }, [ input.type ]),
				input.type === 'element'
					? v('input', {
						key: input.key,
						classes: css.input,
						focus,
						onfocus: () => this._onfocus(input),
						placeholder: input.key
					})
					: w(FocusableInput, {
						key: input.key,
						focus,
						onFocus: () => this._onfocus(input)
					})
			]);
		});
	}

	protected render() {
		return v('div', [
			v('button', { onclick: this._previous }, [ 'previous' ]),
			v('button', { onclick: this._next }, [ 'next' ]),
			v('button', { onclick: this._play }, [ 'play' ]),
			v('button', { onclick: this._stop }, [ 'stop' ]),
			v('div', this._renderInputs())
		]);
	}
}

interface AnotherChildFocusWidgetProperties {
	onFocus: () => void;
}

class FocusableInput extends FocusMixin(WidgetBase)<AnotherChildFocusWidgetProperties> {
	protected render() {
		return v('div', [
			v('input', {
				focus: this.shouldFocus,
				classes: css.input,
				onfocus: this.properties.onFocus,
				placeholder: `${this.properties.key}`
			})
		]);
	}
}

