const EventEmitter = require('events');
const childProcess = require('child_process');
const helpers = require('./helpers');
const path = require('path');

const DEFAULT_OPTIONS = {
    restartDelay: 500
};

class ChildProcessManager extends EventEmitter
{
    constructor(options)
    {
        super();
        var e = this._childProcessEndHandler.bind(this);
        this._childProcessHandlers = {
            'error': e
        ,   'exit': e
        ,   'message': this.emit.bind(this, 'message')
        };
        this._parseOptions(options);
        this._childProcess = null;
        this.args = [];
    }

    stop()
    {
        if (!this._childProcess) return;
        this._childProcessAborted = true;
        this._childProcess.kill();
    }

    start(options)
    {
        if (this._childProcess || this._childProcessRestartTimeout) return;

        this._parseOptions(options);

        this._childProcessAborted = false;
        this._childProcess = childProcess[this.type](this.exec, this.args, this.options);
        helpers.addListenersTo(this._childProcess, this._childProcessHandlers);
        this._started = true;
        this.emit('started');
    }

    send(...args)
    {
        if (this._childProcess) return this._childProcess.send(...args);
        else return false;
    }

    started()
    {
        return this._started;
    }

    process()
    {
        return this._childProcess;
    }

    _childProcessEndHandler(e)
    {
        if (this._childProcess)
        {
            helpers.removeListenersFrom(this._childProcess, this._childProcessHandlers);
            this._childProcess = null;
            this._started = false;
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

    _parseOptions(options)
    {
        this.options = Object.assign({}, DEFAULT_OPTIONS, this.options, options);

        if (Array.isArray(this.options.args))
        {
            this.args = this.options.args || [];
            delete this.options.args;
        }

        if (this.options.command)
        {
            if (Array.isArray(this.options.command)) this.options.command = path.join(...this.options.command);
            this.type = 'spawn';
            this.exec = this.options.command;
            delete this.options.command;
        }
        else if (this.options.modulePath)
        {
            if (Array.isArray(this.options.modulePath)) this.options.modulePath = path.join(...this.options.modulePath);
            this.type = 'fork';
            this.exec = this.options.modulePath;
            delete this.options.modulePath;

        }

        if (typeof this.exec !== 'string') throw new Error ('options must contain `command` or `modulePath`');
    }
}

module.exports = exports = ChildProcessManager;