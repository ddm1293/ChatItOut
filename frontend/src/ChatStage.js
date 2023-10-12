// A representation of the the 5 stages

export default class ChatStage {
    constructor(stageName) {
      this.name = stageName || "invitation";
      this.stages = [
        "invitation",
        "connection",
        "exchange",
        "agreement",
        "reflection",
        "complete"
      ];
    }

    setNextStage() {
      const currentStageIndex = this.stages.findIndex(stage => stage === this.name);
      console.log(`setNextStage, current stage: ${this.stages[currentStageIndex]}, next stage: ${this.stages[currentStageIndex + 1]}`)
      if(currentStageIndex === -1 || currentStageIndex === this.stages.length - 1) {
          console.error('Cannot advance stage');
          return;
      }
      
      this.name = this.stages[currentStageIndex + 1];
      console.log(`current stage name: ${this.name}`)
  }
}