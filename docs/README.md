The asynchronous button can update the rendering state dependent on an asynchronous operation. It provides four states:

  * Idle
  * In Progress
  * Success
  * Error

Both of the success and error states are only shown if a timeout is specified for each state. Once the timeout completes
the button will reset back to the idle state. Without either timeout, the button will reset back to the idle state
straight after the asynchronous operation has completed.
