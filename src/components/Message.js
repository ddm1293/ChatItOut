class Message {
    #sender;
    #stage;
    #text;

    constructor(from, stage, msg) {
        this.#sender = from;
        this.#stage = stage;
        this.#text = msg;
    }
}