# node-child-pm
Manager for handling child process, automatically restart them, sending message etc

## Install
    npm install node-child-pm --save

## Usage

In this example the ls command will be executed every seconds. This is not the goal of node-child-pm. This is just for exemple.

    const ChildProcessManager = require('node-child-pm');
    var pm = new ChildProcessManager('ls', ['-lh', '/usr']{restartDelay: 1000, cwd: './'});
    pm.start();


## Reference

class : ChildProcessManager
- event : 'finished'
- pm.start()
- pm.stop()
- pm.started
- pm.process

### Class ChildProcessManager

- #### new ChildProcessManager(command[, args][, options])
    - command :  `<String>` The command to run
    - args : `<Array>` List of string arguments
    - options : `<Object>` options to pass to the [child_process.spawn method](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
        - restartDelay `<int>` Default: 500 - delay before restarting a process in milliseconds


- #### Event 'finsihed'
    - code : exit code or error

        Emitted when process is finished

- #### pm.start([args][, options])

    Spawn the child process, you can pass args and options (see ChildProcessManager constructor)

- #### pm.stop()
    Ends the child process

- #### pm.started `<Boolean>`
    `true` if the process is running

- #### pm.process `<child_process>`
    The process attribute exposes the child process if you need it.
