module.exports = {
    addListenersTo
,   removeListenersFrom
};

function addListenersTo (target, listeners)
{
    for (var i in listeners)
    {
        target.on(i,listeners[i]);
    }
    return target;
}

function removeListenersFrom (target, listeners)
{
    for (var i in listeners)
    {
        target.removeListener(i,listeners[i]);
    }
    return target;
}