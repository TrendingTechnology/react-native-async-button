// tslint:disable: no-any

import renderComponent, { Component } from '@ef-carbon/react-render-component';
import * as React from 'react';
import { ActivityIndicator, StyleProp, TouchableHighlight, View, ViewStyle } from 'react-native';

import styles from './styles';

export type Milliseconds = number;

export type Callback = () => void;

export interface IOnPress {
  /**
   * Invoked when the user taps the button
   */
  onPress(): Promise<void>;
}

export interface IDisabled {
  /**
   * Determines if the button is enabled or not
   */
  disabled: boolean;
}

export interface ISuccessTimeout {
  /**
   * The amount of time that the success component will be shown after a successful asynchronous operation. Can be set
   * to `Infinity` to show the success component with no reset which is useful for single asynchronous operation such as
   * submitting data. The button can be explicitly reset with `Button.reset` if needed.
   */
  successTimeout: Milliseconds;
}

export interface IFailureTimeout {
  /**
   * The amount of time that the failure component will be shown. Can be set to `Infinity` to show the failure component
   * with no reset. The button can be explicitly reset with `Button.reset` if needed.
   */
  failureTimeout: Milliseconds;
}

export interface IStyle {
  /**
   * The style for the component
   */
  style: StyleProp<ViewStyle>;
}

export interface IIdleComponent {
  /**
   * The component that will be rendered when the button is idle
   */
  IdleComponent: Component;
}

export interface IProcessingComponent {
  /**
   * Rendered when the asynchronous operation is in flight, defaults to `ActivityIndicator`
   */
  ProcessingComponent: Component;
}

export interface ISuccessComponent {
  /**
   * Rendered when the asynchronous operation has successfully completed. Will be shown for `successTimeout` before
   * resetting back to the idle state. Defaults to the `ProcessingComponent`
   */
  SuccessComponent: Component;
}

export interface IFailureComponent {
  /**
   * Rendered when the asynchronous operation has returned an failure. Will be shown for `failureTimeout` before
   * resetting back to the idle state. Defaults to the `ProcessingComponent`
   */
  FailureComponent: Component;
}

export interface IOnProcessing {
  /**
   * Invoked when the user has requested the asynchronous operation to occur
   */
  onProcessing: Callback;
}

export interface IOnSuccess {
  /**
   * Invoked when the asynchronous function successfully completed
   */
  onSuccess: Callback;
}

export interface IOnFailure {
  /**
   * Invoked when the asynchronous operation created an failure
   */
  onFailure: Callback;
}

export interface IOnComplete {
  /**
   * Invoked when the button has completed the asynchronous operation
   */
  onComplete: Callback;
}

export interface IBaseProps extends
  Partial<IDisabled>,
  Partial<ISuccessTimeout>,
  Partial<IFailureTimeout>,
  Partial<IStyle>,
  IIdleComponent,
  Partial<IProcessingComponent>,
  Partial<ISuccessComponent>,
  Partial<IFailureComponent>,
  Partial<IOnProcessing>,
  Partial<IOnSuccess>,
  Partial<IOnFailure>,
  Partial<IOnComplete> { }

export interface IProps extends IOnPress, IBaseProps { }

export type Infinity = number;

export interface IState {
  error?: Error;
  promise?: Promise<void>;
  disabled: boolean;
  timer?: Infinity | NodeJS.Timer;
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
class AsyncButton extends React.PureComponent<IProps, IState> {
  private updateState: <K extends keyof IState>(
    state: ((prevState: Readonly<IState>, props: IProps) => (Pick<IState, K> | IState)) | (Pick<IState, K> | IState),
    callback?: () => void
  ) => void;

  constructor(props: IProps) {
    super(props);
    this.state = {
      disabled: props.disabled || false
    };
    this.updateState = this.setState;
  }

  componentWillUnmount(): void {
    const { timer } = this.state;
    if (timer !== undefined || timer !== Infinity) { clearTimeout(timer as NodeJS.Timer); }
    this.updateState = <K extends keyof IState>(
      _state: ((prevState: Readonly<IState>, props: IProps) => (Pick<IState, K> | IState)) | (Pick<IState, K> | IState),
      _callback?: () => void
    ) => { };  // tslint:disable-line:no-empty
  }

  componentWillReceiveProps({ disabled: prop }: IProps): void {
    this.setState(({ disabled: state }) => ({ disabled: state || prop || false }));
  }

  render(): React.ReactElement<any> {
    const element = this.renderElement();
    return (this.state.disabled) ?
      (<View style={[styles.container, this.props.style]}>{element}</View>) :
      (
        <TouchableHighlight
          style={[styles.container, this.props.style]}
          underlayColor='transparent'
          onPress={this.handlePress}
        >
          {element}
        </TouchableHighlight>
      );
  }

  /**
   * The button is idle and awaiting user input to state the asyncronous operation
   */
  isIdle(): boolean {
    return !(this.success || this.processing || this.failure);
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
    this.updateState({ promise: undefined, error: undefined, timer: undefined, disabled: !!this.props.disabled });
  }

  private process(): void {
    try {
      if (this.props.onProcessing) { this.props.onProcessing(); }
    } finally {
      const promise = this.props.onPress().then(this.resolve, this.reject);
      this.updateState({ promise, disabled: true });
    }
  }

  private setTimeout(duration?: Milliseconds): NodeJS.Timer | Infinity | undefined {
    if (duration === undefined) {
      this.complete();
    } else if (duration !== Infinity) {
      return setTimeout(this.complete, duration || 0);
    }
    return duration;
  }

  private readonly resolve = (): void => {
    const { successTimeout: timeout } = this.props;
    try {
      if (this.props.onSuccess) { this.props.onSuccess(); }
    } finally {
      this.updateState({ promise: undefined, timer: this.setTimeout(timeout) });
    }
  }

  private readonly reject = (error: Error): void => {
    const { failureTimeout: timeout } = this.props;
    try {
      if (this.props.onFailure) { this.props.onFailure(); }
    } finally {
      this.updateState({ promise: undefined, timer: this.setTimeout(timeout), error });
    }
  }

  private readonly complete = (): void => {
    try {
      if (this.props.onComplete) { this.props.onComplete(); }
    } finally {
      this.updateState({ promise: undefined, error: undefined, timer: undefined, disabled: !!this.props.disabled });
    }
  }

  private readonly handlePress = (): void => {
    if (this.idle) {
      this.process();
    }
  }

  private renderElement(): React.ReactElement<any> | undefined {
    if (this.processing) {
      return this.renderProcessingComponent();
    } else if (this.success) {
      return this.renderSuccessComponent();
    } else if (this.failure) {
      return this.renderFailureComponent();
    } else {
      return this.renderIdleComponent();
    }
  }

  private renderIdleComponent(): React.ReactElement<any> {
    const element = renderComponent(this.props.IdleComponent);
    if (!element) {
      throw new Error(`An idle component must be provided`);
    }
    return element;
  }

  private renderProcessingComponent(): React.ReactElement<any> | undefined {
    return renderComponent(this.props.ProcessingComponent || ActivityIndicator);
  }

  private renderSuccessComponent(): React.ReactElement<any> | undefined {
    return renderComponent(this.props.SuccessComponent || this.props.IdleComponent);
  }

  private renderFailureComponent(): React.ReactElement<any> | undefined {
    return renderComponent(this.props.FailureComponent || this.props.IdleComponent);
  }
}

export interface IAsyncButtonStatic extends React.ComponentClass<IProps> {
  /**
   * Resets the button back to the idle state. Can only be done when the state is not `processing`
   */
  reset(): void;

  /**
   * The button is idle and awaiting user input to state the asyncronous operation
   */
  isIdle(): boolean;

  /**
   * The button is current performing the asyncronous operation
   */
  isProcessing(): boolean;

  /**
   * The asyncronous operation completed and the button is currently showing the successful state for `successTimeout`
   */
  isSuccess(): boolean;

  /**
   * The asyncronous operation completed and the button is currently showing the failure state for `failureTimeout`
   */
  isFailure(): boolean;

  /**
   * @see {@link isIdle}
   */
  readonly idle: boolean;

  /**
   * @see {@link isProcessing}
   */
  readonly processing: boolean;

  /**
   * @see {@link isSuccess}
   */
  readonly success: boolean;

  /**
   * @see {@link isFailure}
   */
  readonly failure: boolean;
}

const component: React.ComponentClass<IProps> = AsyncButton;

export default component;
