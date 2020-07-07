export default class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.hand = [];
        this.isComputer = isComputer;
    }
}