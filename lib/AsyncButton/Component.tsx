import * as React from 'react';
import { ActivityIndicator, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { MillisecondsAccepted as Milliseconds, millisecondsConvert } from '@ef-carbon/primitive';
import { CancellablePromise, CancelledPromiseError, ICancellablePromise } from '@ef-carbon/promise';
import { ITheme } from '@ef-carbon/react-native-style';
import renderComponent, { Component } from '@ef-carbon/react-render-component';

import styles from './styles';

export type Callback = () => void;

export interface IAsyncButtonComponentState {
  idle: boolean;
  disabled: boolean;
  processing: boolean;
  success: boolean;
  failure: boolean;
}

export interface IAsyncButtonProps {
  /**
   * Invoked when the user taps the button
   */
  onPress(): Promise<void>;

  /**
   * Determines if the button is enabled or not
   */
  disabled?: boolean;

  /**
   * The theme to use to style the button
   */
  theme?: ITheme;

  /**
   * The opacity to be applied to the disabled component, defaults to 0.6
   */
  disabledOpacity?: number;

  /**
   * The amount of time that the success component will be shown after a successful asynchronous operation. Can be set
   * to `Infinity` to show the success component with no reset which is useful for single asynchronous operation such as
   * submitting data. The button can be explicitly reset with `Button.reset` if needed.
   */
  successTimeout?: Milliseconds;

  /**
   * The amount of time that the failure component will be shown. Can be set to `Infinity` to show the failure component
   * with no reset. The button can be explicitly reset with `Button.reset` if needed.
   */
  failureTimeout?: Milliseconds;

  /**
   * The style for the component
   */
  style?: StyleProp<ViewStyle>;

  /**
   * The component that will be rendered when the button is idle
   */
  IdleComponent: Component<IAsyncButtonComponentState>;

  /**
   * The component that will be rendered when the button is disabled
   */
  DisabledComponent?: Component<IAsyncButtonComponentState>;

  /**
   * Rendered when the asynchronous operation is in flight, defaults to `ActivityIndicator`
   */
  ProcessingComponent?: Component<IAsyncButtonComponentState>;

  /**
   * Rendered when the asynchronous operation has successfully completed. Will be shown for `successTimeout` before
   * resetting back to the idle state. Defaults to the `ProcessingComponent`
   */
  SuccessComponent?: Component<IAsyncButtonComponentState>;

  /**
   * Rendered when the asynchronous operation has returned an failure. Will be shown for `failureTimeout` before
   * resetting back to the idle state. Defaults to the `ProcessingComponent`
   */
  FailureComponent?: Component<IAsyncButtonComponentState>;

  /**
   * Invoked when the user has requested the asynchronous operation to occur
   */
  onProcessing?: Callback;

  /**
   * Invoked when the asynchronous function successfully completed
   */
  onSuccess?: Callback;

  /**
   * Invoked when the asynchronous operation created an failure
   */
  onFailure?: Callback;

  /**
   * Invoked when the button has completed the asynchronous operation
   */
  onComplete?: Callback;
}

export type AsyncButtonInfinity = number;

export interface IAsyncButtonState {
  error?: Error;
  promise?: ICancellablePromise<void>;
  timer?: AsyncButtonInfinity | NodeJS.Timer;
}

function processingComponent(): Component<IAsyncButtonComponentState> {
  // tslint:disable-next-line:no-use-before-declare
  return AsyncButton.ProcessingComponent || ActivityIndicator;
}

/**
 * A button that can change between multiple states:
 * ```
 *                              +-------+
 * +---+------------------------> Idle  <------------------------+---+
 * |   |                        +---+---+                        |   |
 * |   |                            +                            |   |
 * |   |                         onPress                         |   |
 * |   |                            |                            |   |
 * |   |                     +------v------+                     |   |
 * |   |                     | Processing  |                     |   |
 * |   |                     +------+------+                     |   |
 * |   |                            |                            |   |
 * |   |                 +-resolve--+---reject-+                 |   |
 * |   |                 |                     |                 |   |
 * |   |       +---------+--------+   +--------+---------+       |   |
 * |   +-false-+ !!successTimeout |   | !!failureTimeout +-false-+   |
 * |           +---------+--------+   +--------+---------+           |
 * |                     |                     |                     |
 * |                +----+----+           +----+----+                |
 * |                | Success <---+   +---> Failure |                |
 * |                +----+----+ true true +----+----+                |
 * |                     |        |   |        |                     |
 * | +-------------------v--------++ ++--------v-------------------+ |
 * | | successTimeout === Infinity | | failureTimeout === Infinity | |
 * | +--------------+--------------+ +--------------+--------------+ |
 * |                |                               |                |
 * | +--------------v--------------+ +--------------v--------------+ |
 * +-+ await sleep(successTimeout) | | await sleep(failureTimeout) +-+
 *   +-----------------------------+ +-----------------------------+
 * ```
 * @example <caption>Demo video code</caption>
 * <img
 *   style="float: right; border: 1px solid grey; box-shadow: 0 0 4px rgba(0, 0, 0, 0.25); margin: 2.5em 1em 0"
 *   src="media://demo.gif"
 * />
 * ```
 * <View>
 *   <AsyncButton
 *     IdleComponent={<Text>Send</Text>}
 *     onPress={success}
 *   />
 *   <AsyncButton
 *     IdleComponent={<Text>Send + Reset</Text>}
 *     successTimeout={1000}
 *     SuccessComponent={SuccessComponent}
 *     onPress={success}
 *   />
 *   <AsyncButton
 *     IdleComponent={<Text>Send + No Reset</Text>}
 *     successTimeout={Infinity}
 *     SuccessComponent={SuccessComponent}
 *     onPress={success}
 *   />
 *   <AsyncButton
 *     IdleComponent={<Text>Error + Reset</Text>}
 *     failureTimeout={1000}
 *     FailureComponent={FailureComponent}
 *     onPress={error}
 *   />
 *   <AsyncButton
 *     IdleComponent={<Text>Error + No Reset</Text>}
 *     failureTimeout={Infinity}
 *     FailureComponent={FailureComponent}
 *     onPress={error}
 *   />
 * </View>
 * ```
 */
export class AsyncButton extends React.PureComponent<IAsyncButtonProps, IAsyncButtonState> {
  /**
   * The default activity indicator to show
   */
  // tslint:disable-next-line:variable-name
  static ProcessingComponent: Component<IAsyncButtonComponentState> = ActivityIndicator;

  constructor(props: IAsyncButtonProps) {
    super(props);
    this.state = {};
  }

  componentWillUnmount(): void {
    const { timer, promise } = this.state;
    if (timer !== undefined || timer !== Infinity) {
      clearTimeout(timer as NodeJS.Timer);
    }
    if (promise) {
      promise.cancel();
    }
  }

  render(): React.ReactNode {
    const element = this.renderElement();

    const { theme, disabledOpacity: prop } = this.props;
    const disabled = !this.disabled ? undefined :
      theme ? theme.opacity.cloudy :
        { opacity: prop !== undefined ? prop : 0.6 };

    const view = (<View style={[styles.container, this.props.style, disabled]}>{element}</View>);

    if (this.processing || this.disabled) {
      return view;
    }

    const opacity = theme ? theme.constants.opacity.translucent : undefined;

    return (<TouchableOpacity activeOpacity={opacity} onPress={this.handlePress}>{view}</TouchableOpacity>);
  }

  /**
   * The button is idle and awaiting user input to state the asyncronous operation
   */
  isIdle(): boolean {
    return !(this.success || this.processing || this.failure);
  }

  /**
   * The button is disabled and cannot be pressed
   */
  isDisabled(): boolean {
    return this.props.disabled || false;
  }

  /**
   * The button is current performing the asyncronous operation
   */
  isProcessing(): boolean {
    const { promise, timer } = this.state;
    return promise !== undefined && timer === undefined;
  }

  /**
   * The asyncronous operation completed and the button is currently showing the successful state for `successTimeout`
   */
  isSuccess(): boolean {
    const { promise, timer, error } = this.state;
    return promise === undefined && timer !== undefined && error === undefined;
  }

  /**
   * The asyncronous operation completed and the button is currently showing the failure state for `failureTimeout`
   */
  isFailure(): boolean {
    const { promise, timer, error } = this.state;
    return promise === undefined && timer !== undefined && error !== undefined;
  }

  /**
   * @see {@link isIdle}
   */
  get idle(): boolean {
    return this.isIdle();
  }

  /**
   * @see {@link isDisabled}
   */
  get disabled(): boolean {
    return this.isDisabled();
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
    if (this.processing) {
      throw new Error('Cannot reset the button whilst the asynchronous operation is processing');
    }
    this.setState({ promise: undefined, error: undefined, timer: undefined });
  }

  private process(): void {
    try {
      if (this.props.onProcessing) { this.props.onProcessing(); }
    } finally {
      const promise = new CancellablePromise<void>((resolve, reject) => {
        this.props.onPress().then(resolve, reject);
      });

      promise
        .then(this.resolve)
        .catch(error => {
          if (!(error instanceof CancelledPromiseError)) {
            this.reject(error);
          }
        });

      this.setState({ promise });
    }
  }

  private processingComponent(): Component<IAsyncButtonComponentState> {
    return this.props.ProcessingComponent || processingComponent();
  }

  private setTimeout(duration?: Milliseconds): NodeJS.Timer | AsyncButtonInfinity | undefined {
    if (duration === undefined) {
      this.complete();
      return duration;
    }

    const converted = millisecondsConvert(duration);

    if (converted !== Infinity) {
      return setTimeout(this.complete, converted || 0);
    }

    return converted;
  }

  private readonly resolve = (): void => {
    const { successTimeout: timeout } = this.props;
    try {
      if (this.props.onSuccess) { this.props.onSuccess(); }
    } finally {
      this.setState({ promise: undefined, timer: this.setTimeout(timeout) });
    }
  }

  private readonly reject = (error: Error): void => {
    const { failureTimeout: timeout } = this.props;
    try {
      if (this.props.onFailure) { this.props.onFailure(); }
    } finally {
      this.setState({ promise: undefined, timer: this.setTimeout(timeout), error });
    }
  }

  private readonly complete = (): void => {
    try {
      if (this.props.onComplete) { this.props.onComplete(); }
    } finally {
      this.setState({ promise: undefined, error: undefined, timer: undefined });
    }
  }

  private readonly handlePress = (): void => {
    if (this.idle) {
      this.process();
    }
  }

  private renderElement(): React.ReactNode {
    if (this.processing) {
      return this.renderProcessingComponent();
    } else if (this.success) {
      return this.renderSuccessComponent();
    } else if (this.failure) {
      return this.renderFailureComponent();
    } else if (this.disabled) {
      return this.renderDisabledComponent();
    } else {
      return this.renderIdleComponent();
    }
  }

  private renderIdleComponent(): React.ReactNode {
    const element = renderComponent(this.props.IdleComponent, this);
    if (!element) {
      throw new Error(`An idle component must be provided`);
    }
    return element;
  }

  private renderDisabledComponent(): React.ReactNode {
    return renderComponent(this.props.DisabledComponent || this.props.IdleComponent, this);
  }

  private renderProcessingComponent(): React.ReactNode {
    return renderComponent(this.processingComponent(), this);
  }

  private renderSuccessComponent(): React.ReactNode {
    return renderComponent(this.props.SuccessComponent || this.processingComponent(), this);
  }

  private renderFailureComponent(): React.ReactNode {
    return renderComponent(this.props.FailureComponent || this.processingComponent(), this);
  }
}

export interface IAsyncButtonStatic extends React.ComponentClass<IAsyncButtonProps> { }

const component: IAsyncButtonStatic = AsyncButton;

export {
  component as Component,
  component as AsyncButtonComponent,
  IAsyncButtonStatic as IStatic,
  IAsyncButtonProps as IProps,
  IAsyncButtonState as IState,
  AsyncButtonInfinity as Infinity,
  IAsyncButtonComponentState as IComponentState
};

export default AsyncButton;
