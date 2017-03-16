# node-child-pm
Manager for handling child process, automatically restart them, sending message etc

## Install
    npm install node-child-pm --save

## Usage

In this example the ls command will be executed every seconds. This is not the goal of node-child-pm. This is just for exemple.

    const ChildProcessManager = require('node-child-pm');
    var pm = new ChildProcessManager({
        command: 'ls',
        args: ['-lh', '/usr'],
        restartDelay: 1000,
        cwd: './'
    });
    pm.start();


## Reference

class : ChildProcessManager
- *event : 'started'*
- *event : 'finished'*
- *event : 'message'*
- *pm.start()*
- *pm.stop()*
- *pm.send()*
- *pm.started*
- *pm.process*

### Class ChildProcessManager

- #### new ChildProcessManager(options)
    - *options* : `<Object>` options to pass to the
        - *command* | *modulePath* `<string>` (Required) : if *command* is used, the process will be started with [child_process.spawn method](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
          If *modulePath* is used, the process will be started with [child_process.fork method](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)
        - *args* `<Array>` arguments used to spawn or fork the process
        - *restartDelay* `<int>` Default: 500 - delay before restarting a process in milliseconds


- #### Event 'started'
    Emitted each time the process is spawned or forked

- #### Event 'finsihed'
    - *code* : exit code or error
        Emitted when process is finished

- #### Event 'message'
    - *message* : the message transmitted by the process
        Emitted when the process send a message - *only for forked process*. (see [child_process documentation](https://nodejs.org/api/child_process.html#child_process_event_message))

- #### pm.start(options)
    Spawn the child process, you can pass args and options (see ChildProcessManager constructor)

- #### pm.stop()
    Ends the child process

- #### pm.send(message[, sendHandle[, options]][, callback])
    - *message* : the message to send to the process
        for other arguments (see [child_process documentation](https://nodejs.org/api/child_process.html#child_process_child_send_message_sendhandle_options_callback))

- #### pm.started()
    *return* `<Boolean>` : `true` if the process is running

- #### pm.process()
    *return* `<child_process>` : The process attribute exposes the child process if you need it.
