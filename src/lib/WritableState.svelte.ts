import { tick } from "svelte";

export class WritableState<T> {
  private _value = $state<T>() as T;
  private subscribers = 0;
  private start?: () => () => void;
  private stop?: () => void;

  constructor(defaultValue: T, start: () => () => void) {
    this._value = defaultValue;
    this.start = start;
  }

  public get value(): T | undefined {
    if ($effect.tracking()) {
      $effect(() => {
        if (this.subscribers === 0) {
          this.stop = this.start?.();
        }
        this.subscribers++;

        return () => {
          tick().then(() => {
            this.subscribers--;
            if (this.subscribers === 0) {
              this.stop?.();
              this.stop = undefined;
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
