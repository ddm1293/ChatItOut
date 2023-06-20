class Chat {
    #id; // for ChatHistory dict
    #time;
    #date;
    #messages; // Message[]

    constructor(time, date, messages) {
        this.time = time;
        this.date = date;
        this.messages = messages;
    }

    addMessage(message) {
        this.messages.push(message);
    }
}