
export class RealmEffect {
    constructor() {
        this.giveObject = new GiveObject();
    }
}

export class GiveObject {
    constructor() {
        this.entity = "";
        this.object = "";
    }
}

export function isGiveObject(effect) {
    return effect.hasOwnProperty('giveObject');
}

export function makeGiveObject(effect) {
    effect.giveObject = new GiveObject();
    delete effect.setState;
    delete effect.adjustState;
}

export class SetState {
    constructor() {
        this.source = "";
        this.key = "";
        this.value = "";
    }
}

export function isSetState(effect) {
    return effect.hasOwnProperty('setState');
}

export function makeSetState(effect) {
    delete effect.giveObject;
    effect.setState = new SetState();
    delete effect.adjustState;
}

export class AdjustState {
    constructor() {
        this.source = "";
        this.key = "";
        this.value = "";
    }
}

export function isAdjustState(effect) {
    return effect.hasOwnProperty('adjustState');
}

export function makeAdjustState(effect) {
    delete effect.giveObject;
    delete effect.setState;
    effect.adjustState = new AdjustState();
}

export class ObjectEffect {
    constructor() {
        this.adjustOwnerState = new AdjustOwnerState();
    }
}

export class AdjustOwnerState {
    constructor() {
        this.key = "";
        this.value = 0;
    }
}

export function isAdjustOwnerState(effect) {
    return effect.hasOwnProperty('adjustOwnerState');
}

export function makeAdjustOwnerState(effect) {
    effect.adjustOwnerState = new AdjustOwnerState();
}

export class Condition {
    constructor() {
        this.not = false;
        this.always = true;
    }
}

export function isAlways(condition) {
    return condition.hasOwnProperty('always');
}

export function makeAlways(condition) {
    condition.always = true;
    delete condition.hasObject;
    delete condition.hasState;
}

export class HasObject {
    constructor() {
        this.entity = "";
        this.object = "";
    }
}

export function isHasObject(condition) {
    return condition.hasOwnProperty('hasObject');
}

export function makeHasObject(condition) {
    delete condition.always;
    condition.hasObject = new HasObject();
    delete condition.hasState;
}

export class HasState {
    constructor() {
        this.source = "";
        this.key = "";
        this.value = "";
    }
}

export function isHasState(condition) {
    return condition.hasOwnProperty('hasState');
}

export function makeHasState(condition) {
    delete condition.always;
    delete condition.hasObject;
    condition.hasState = new HasState();
}

export class State {
    constructor() {
        this.key = "";
        this.value = "";
    }
}

export class Entity {
    constructor() {
        this.states = [];
    }
}

export class Object {
    constructor() {
        this.owner = "";
        this.states = [];
        this.effects = [];
    }
}

export class Realm {
    constructor() {
        this.entities = [];
        this.objects = [];
    }
}

export class Decision {
    constructor() {
        this.text = "";
        this.condition = new Condition();
        this.targetSection = ""
    }
}

export class Section {
    constructor() {
        this.text = "";
        this.effects = [];
        this.decisions = [];
    }
}

export class Narrative {
    constructor() {
        this.title = "New Narrative"
        this.author = "Unknown Author"
        this.realm = new Realm();
        this.sections = [];
    }
}
