class ChatStage {
    constructor() {
      this.name = "invitation";
    }
  
    doSomething() {
      console.log("wtf");
    }
  
    setInvitation() {
      this.name = 'invitation';
    }
  
    setConnection() {
      this.name = 'connection';
    }
  
    setExchange() {
      this.name = 'exchange';
    }
  
    setAgreement() {
      this.name = 'agreement';
    }
  
    setReflection() {
      this.name = 'reflection';
    }
  
    setComplete() {
      this.name = 'complete';
    }
  }
  
  export default ChatStage;