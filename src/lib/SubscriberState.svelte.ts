import { tick } from "svelte";

type SubscriberStateOptions<T> = {
  defaultValue: T;
  start?: () => void;
  stop?: () => void;
};

export class SubscriberState<T> {
  private _value = $state<T>() as T;
  private subscribers = 0;
  private start?: () => void;
  private stop?: () => void;

  constructor({ defaultValue, start, stop }: SubscriberStateOptions<T>) {
    this._value = defaultValue;
    this.start = start;
    this.stop = stop;
  }

  public get value(): T | undefined {
    if ($effect.tracking()) {
      $effect(() => {
        if (this.subscribers === 0) {
          this.start?.();
        }
        this.subscribers++;

        return () => {
          tick().then(() => {
            this.subscribers--;
            if (this.subscribers === 0) {
              this.stop?.();
            }
          });
        };
      });
    }
    return this._value;
  }

  public set value(newValue: T) {
    this._value = newValue;
  }
}
