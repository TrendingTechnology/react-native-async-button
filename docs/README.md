<img style="float: right; border: 1px solid grey; box-shadow: 0 0 4px rgba(0, 0, 0, 0.25); margin: 1em 0 1em 1em; width: 35%; max-width: 20em" src="media/demo.gif" />

The asynchronous button can update the rendering state dependent on an asynchronous operation. It provides four states:

  * Idle
  * Processing
  * Success
  * Error

Both of the success and error states are only shown if a timeout is specified for each state. Once the timeout completes
the button will reset back to the idle state. Without either timeout, the button will reset back to the idle state
straight after the asynchronous operation has completed.

The button can be used for *any* asynchronous operation, but is commonly used for sending data to a server. The button
can handle a successful or failed transmission and represent the state of that to the user. The developer can add
callbacks that can be fired upon changing of states. This makes it trivial to provide a nice asynchronous user
experience.

The button naturally resets itself but can be configured to display either, or both, the successful and failure states
for a defined duration. The duration can be set to `Infinity` to implement a one-shot submission button. The button can
be explicitly reset with the `reset` method.
