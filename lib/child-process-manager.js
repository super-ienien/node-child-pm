const EventEmitter = require('events');
const {spawn} = require('child_process');
const helpers = require('./helpers');
const path = require('path');

ChildProcessManager.DEFAULT_OPTIONS = {
    restartDelay: 500
};

class ChildProcessManager extends EventEmitter
{
    constructor(command, args, options)
    {
        super();
        var e = this._childProcessEndHandler.bind(this);
        this._childProcessHandlers = {
            'error': e
        ,   'exit': e
        };
        this.command = command;
        this.options = Object.assign({}, ChildProcessManager.DEFAULT_OPTIONS, options);
        this.started = false;
        if (Array.isArray (args))
        {
            this.args = args;
            this.options = Object.assign(this.options, options);
        }
        else if (args && typeof args === 'object')
        {
            this.options = Object.assign({}, ChildProcessManager.DEFAULT_OPTIONS, args);
        }
        else
        {
            this.args = [];
            this.options = Object.assign({}, ChildProcessManager.DEFAULT_OPTIONS);
        }
    }

    stop()
    {
        if (!this._childProcess) return;
        this._childProcessAborted = true;
        this._childProcess.kill();
    }

    start(args, options)
    {
        if (this._childProcess || this._childProcessRestartTimeout) return;
        if (Array.isArray (args))
        {
            this.args = args;
            this.options = Object.assign(this.options, options);
        }
        else if (args && typeof args === 'object')
        {
            this.options = Object.assign({}, ChildProcessManager.DEFAULT_OPTIONS, args);
        }

        this._childProcessAborted = false;
        this._childProcess = spawn(this.command, this.args, this.options);
        helpers.addListenersTo(this._childProcess, this._childProcessHandlers);
        this.started = true;
    }

    _childProcessEndHandler(e)
    {
        if (this._childProcess)
        {
            helpers.removeListenersFrom(this._childProcess, this._childProcessHandlers);
            this._childProcess = null;
            this.started = false;
            this.emit('finished', e);
            if (!this._childProcessAborted)
            {
                this._childProcessRestartTimeout = setTimeout(() =>
                {
                    this._childProcessRestartTimeout = false;
                this.start()
            }, this.options.restartDelay);
            }
        }
    }
}

module.exports = exports = ChildProcessManager;