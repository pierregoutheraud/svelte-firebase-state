import { tick } from "svelte";

interface SubscriberStateOptions {
	start: () => void;
	stop: () => void;
}

export class SubscriberState<T> {
	private _value: T | undefined = $state(undefined);
	private start: SubscriberStateOptions["start"];
	private stop: SubscriberStateOptions["stop"];
	subscribers = 0;

	constructor({ start, stop }: SubscriberStateOptions) {
		this.start = start;
		this.stop = stop;
	}

	public get value(): T | undefined {
		if ($effect.tracking()) {
			$effect(() => {
				if (this.subscribers === 0) {
					this.start();
				}
				this.subscribers++;

				return () => {
					tick().then(() => {
						this.subscribers--;
						if (this.subscribers === 0) {
							this.stop();
						}
					});
				};
			});
		}
		return this._value;
	}

	public set value(newValue: T | undefined) {
		this._value = newValue;
	}
}
