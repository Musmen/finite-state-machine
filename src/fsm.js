class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error('config is not defined!');

        this._states = config.states;
        
        this._initialState = config.initial;
        this._currentState = config.initial;
        this._transitions = this._states[this._currentState].transitions;

        this._history = [];
        this._redo = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this._states[state]) throw new Error('state is not defined!');
        this._history.push(this._currentState);
        this._currentState = state;
        this._transitions = this._states[this._currentState].transitions;
        this._redo = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this._transitions[event]) throw new Error('event is not defined!');
        this.changeState(this._transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this._initialState);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) return Object.keys(this._states); 

        var resList = []
        var keys = '';
        for (keys in this._states) {
            if (this._states[keys].transitions[event]) resList.push(keys);
        };
        return resList;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this._history.length) return false;
        var temp = this._redo.slice();
        this.changeState(this._history.pop());
        this._redo = temp.slice();
        this._redo.push(this._history.pop());
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this._redo.length) return false;
        var temp = this._redo.slice();
        this.changeState(this._redo.pop());
        temp.pop();
        this._redo = temp.slice();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._history = [];
        this._redo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
