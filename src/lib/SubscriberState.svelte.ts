import { tick } from "svelte";

export abstract class SubscriberState<T> {
  private _value: T | undefined = $state(undefined);
  private subscribers = 0;

  abstract start(): void;
  abstract stop(): void;

  constructor(defaultValue?: T) {
    this._value = defaultValue;
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
