import { v4 as uuidv4 } from 'uuid'
import { immerable } from 'immer';

export default class ChatSession {
  constructor() {
    this.sessionId = uuidv4();
    this.messages = {
        invitation: [
            { type: 'newStage', message: 'invitation' },
            { type: 'chatbot', message: "I'm an AI conflict coach here to help you with any conflicts or issues you may be facing. How can I assist you today?" }
        ],
        connection: [],
        exchange: [],
        agreement: [],
        reflection: []
    };
    this.time = new Date().toISOString();
    this.stage = "invitation"
    this.atStartRef = false;
    this.messageCapCount = 0;
    this.refusalCapCount = 0;
    this.completed = false;
    this[immerable] = true;
    this.messageCap =  {
      invitation: {
        msgCount: 0,
        msgCap: 1
      },
      connection: {
        msgCount: 0,
        msgCap: 1
      },
      exchange: {
        msgCount: 0,
        msgCap: 1
      },
      agreement: {
        msgCount: 0,
        msgCap: 1
      },
      reflection: {
        msgCount: 0,
        msgCap: 1
      }
    }
  }
}