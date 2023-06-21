export default class Message {
    #sender;
    #stage;
    #text;

    constructor(from, stage, msg) {
        this.#sender = from;
        this.#stage = stage;
        this.#text = msg;
    }

    get sender() {
        return this.#sender;
    }

    get text() {
        return this.#text;
    }

    get stage() {
        return this.#stage;
    }
}