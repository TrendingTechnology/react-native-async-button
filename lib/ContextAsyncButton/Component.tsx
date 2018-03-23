// tslint:disable: no-any

import * as React from 'react';

import AsyncButton, { IBaseProps as IAsyncButtonProps } from '@lib/AsyncButton';

export interface IContext<Context> {
  /**
   * The value that will get passed to the `onPress` handler
   */
  context: Context;
}

export interface IOnPress<Context> {
  /**
   * The value that will get passed to the `onPress` handler
   */
  onPress(context: Context): Promise<void>;
}

export interface IProps<Context> extends IAsyncButtonProps, IContext<Context>, IOnPress<Context> { }

// tslint:disable-next-line:no-empty-interface
export interface IState { }

/**
 * The context button can hold a context that will be passed to the `onPress` callback
 */
export class ContextAsyncButton<Context> extends React.PureComponent<IProps<Context>, IState> {
  private buttonComponent?: AsyncButton = undefined;
  /**
   * The button is idle and awaiting user input to state the asyncronous operation
   */
  isIdle(): boolean {
    if (this.buttonComponent) {
      return this.buttonComponent.isIdle();
    }
    return false;
  }

  /**
   * The button is current performing the asyncronous operation
   */
  isProcessing(): boolean {
    if (this.buttonComponent) {
      return this.buttonComponent.isProcessing();
    }
    return false;
  }

  /**
   * The asyncronous operation completed and the button is currently showing the successful state for `successTimeout`
   */
  isSuccess(): boolean {
    if (this.buttonComponent) {
      return this.buttonComponent.isSuccess();
    }
    return false;
  }

  /**
   * The asyncronous operation completed and the button is currently showing the failure state for `failureTimeout`
   */
  isFailure(): boolean {
    if (this.buttonComponent) {
      return this.buttonComponent.isFailure();
    }
    return false;
  }

  /**
   * @see {@link isIdle}
   */
  get idle(): boolean {
    return this.isIdle();
  }

  /**
   * @see {@link isProcessing}
   */
  get processing(): boolean {
    return this.isProcessing();
  }

  /**
   * @see {@link isSuccess}
   */
  get success(): boolean {
    return this.isSuccess();
  }

  /**
   * @see {@link isFailure}
   */
  get failure(): boolean {
    return this.isFailure();
  }

  reset(): void {
    if (this.buttonComponent) {
      this.buttonComponent.reset();
    }
  }

  // tslint:disable-next-line:no-empty-interface
  render(): React.ReactElement<any> {
    const { context, onPress, ...props } = this.props;
    return (<AsyncButton ref={this.refButton} onPress={this.handlePress} {...props} />);
  }

  private readonly handlePress = async (): Promise<void> => {
    await this.props.onPress(this.props.context);
  }

  private readonly refButton = (instance: AsyncButton | null) => {
    this.buttonComponent = instance || undefined;
  }
}

export interface IContextAsyncButtonStatic<Context> extends React.ComponentClass<IProps<Context>> { }

const component: IContextAsyncButtonStatic<{}> = ContextAsyncButton;

export { component as Component };

export default AsyncButton;
