import React, { useState } from 'react';

export default function StageExp() {
    const [clickedButton, setClickedButton] = useState('stage1');

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      };

      const handleButtonClick = (sectionId) => {
        setClickedButton(sectionId);
        scrollToSection(sectionId);
      };

    return (
        <>
                <div className= "grid grid-rows-10 fixed h-screen top-0 right-0 w-full sm:w-4/5 justify-center overflow-y-scroll">
                    <div className="mt-6 mx-2 sm:mx-12 md:mx-24 lg:mx-36">
                        <ul className="fixed grid grid-cols-5 bg-gray-700 justify-items-center items-center rounded-xl w-11/12 sm:w-3/5 top-16 md:top-10 h-14">
                        <li>
                        <button className={`text-base sm:text-base sm:text-lg ${clickedButton === 'stage1' ? 'bg-[#1993D6] text-white font-bold rounded-lg px-1 sm:px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage1')}>
                                Invitation
                        </button>
                        </li>
                        <li>
                        <button className={`text-base sm:text-lg ${clickedButton === 'stage2' ? 'bg-[#1993D6] text-white font-bold rounded-lg px-1 sm:px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage2')}>
                                Connection
                        </button>
                        </li>
                        <li>
                        <button className={`text-base sm:text-lg ${clickedButton === 'stage3' ? 'bg-[#1993D6] text-white font-bold rounded-lg px-1 sm:px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage3')}>
                                Exchange
                        </button>
                        </li>
                        <li>
                        <button className={`text-base sm:text-lg ${clickedButton === 'stage4' ? 'bg-[#1993D6] text-white font-bold rounded-lg px-1 sm:px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage4')}>
                                Agreement
                        </button>
                        </li>
                        <li>
                        <button className={`text-base sm:text-lg ${clickedButton === 'stage5' ? 'bg-[#1993D6] text-white font-bold rounded-lg px-1 sm:px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage5')}>
                                Reflection
                        </button>
                        </li>
                    </ul>
                    </div>

                    <div id='stage1'>
                        <div className= "mt-28 text-center mt-12 text-2xl text-white font-calibri font-medium">
                            Stage 1: Invitation
                        </div>
                        
                        <div className= "mt-12 mx-24 sm:mx-36 text-medium text-white font-calibri whitespace-pre-line">
                            Creating a collaborative environment begins by assessing the relationship between you and the other person. Tension, fear, and other uncomfortable feelings are often present at the beginning of the conversation. To establish and maintain a collaborative environment, we need to create rapport and reduce tension before delving into the issues of the conflict. It is important to continue to monitor the relationship throughout the conversation. <br /> <br />

                            Mindfulness / preparation questions: <br />
                            •   Awareness <br />
                            <p className="pl-8">
                            o	What are you noticing about your emotions, senses and thoughts as you prepare to initiate this conversation?<br />
                            o	What do you know about the other person’s need for this conversation? <br /> </p>
                            •   Readiness <br />
                            <p className="pl-8">
                            o	What have you done to prepare yourself (and the other person) to have a collaborative conversation? <br />
                            o	How willing are you to engage in a collaborative conversation that may introduce new information or require you to adjust your perspective? <br /> </p>
                            •   Understanding <br />
                            <p className="pl-8">
                            o	How well do you understand what needs to be resolved? <br />
                            o	What facts are you not paying attention to about this situation? <br /> <br /> </p>
                
                            
                            Strategies for the invitation may include: <br />
                            •	What a convenient time to discuss the conflict? <br />
                            •	What would be a mutually convenient, comfortable, and possibly neutral, location or setting for the conversation? <br />
                            •	How can you express your acknowledging and valuing the need to resolve your differences? <br />
                            •	How can you express your collaborative intention regarding the content, process and relationship aspects of the conflict? <br />
                            •	Why are you motivated to resolve differences to the mutual benefit of both parties? <br />
                            •	What is your assessment of the other person’s readiness to resolve the conflict? <br />
                            •	What would listening attentively and expressing yourself clearly look like? <br />
                            •	How can you keep a positive attitude and remain future focused? <br />

                        </div>
                    </div>

                    <div id='stage2'>
                        <div className= "text-center mt-28 text-2xl text-white font-calibri font-medium">
                            Stage 2: Connection
                        </div>
                    
                        <div className= "mt-12 mx-24 sm:mx-36 text-medium text-white font-calibri whitespace-pre-line">
                            It is important to create a connection with the other party and lay the groundwork for an open, collaborative conversation. This begins by valuing the other person’s physical, emotional, and spiritual state. <br /> <br />
                            
                            Creating connection also means taking care of your own well-being and being able to share how you feel with the other person.  Connection creates an atmosphere of openness where both sides feel comfortable to share and disclose.  Establishing connection helps us to recognize that worldviews, cultural differences, and beliefs influence how people show up in a conflict conversation, and it encourages us to respect and express our differences in a collaborative, open way. <br /> <br />

                            Focus of CONNECTION <br /> 
                            At this early stage in the conversation, the topics that need to be discussed may not be entirely clear to either party. Each person needs to establish the scope of the conversation by getting an overall sense of what needs to be resolved (the topics or subject areas requiring resolution).  <br /> 
                            The conversation will be more productive and focused if the general scope of the problem is clearly understood before any issues are explored. Regardless of who initiates the discussion, this early part of the conversation ensures that both parties get an opportunity to say what it is they want to talk about and attempt to resolve. <br /> <br /> 
                            Strategies for connection may include: <br /> 
                            •	How can you be present and be prepared to be in the conversation and nowhere else? <br /> 
                            •	How can you acknowledge the other person and help them to be present in the conversation? <br /> 
                            •	What do you want to resolve in neutral, depersonalized terms? <br /> 
                            •	What would an Invitation for the other person to share their perspective with respect to what they want to resolve sound like? <br /> 
                            •	What would help you to listen actively when the other person is speaking to ensure understanding? <br /> 
                            •	How can you check for clarity while depersonalising what they have said? <br /> 
                            •	When should you combine the gathered topics into a list of things to talk about and resolve? <br /> 
                            •	How can you use descriptive language to frame agenda items in a way that does not assign blame or specify an outcome that meets only one person’s needs? <br /> 
                        </div>
                    </div>

                    <div id='stage3'>
                        <div className= "text-center mt-28 text-2xl text-white font-calibri font-medium">
                            Stage 3: Exchange
                        </div>
                        
                        <div className= "mt-12 mx-24 sm:mx-36 text-medium text-white font-calibri whitespace-pre-line">
                            Focus of EXCHANGE <br /> 
                            Exchanging information may include talking about some aspects of the conflict that have occurred in the past.  Exploring the history of the conflict may help each person to understand what is important to them and why it is important.  <br /> 
                            Exploring the other person’s motivations and disclosing your own motivations helps both parties to understand the conflict better. Motivations include our goals, beliefs, and hopes, as well as our concerns and fears. This part of the conversation involves asking questions, listening attentively, and asserting our voice. It is important to maintain a mindset of curiosity rather than judgment as we try to understand different points of view. <br /> 
                            In this process of mutual discovery, areas of agreement may begin to surface. As the other person talks about what is important to them, you may find yourself thinking differently about their perspective.  This may clear up some assumptions or misunderstandings that you had prior to the exchange and can lead to new ideas or suggestions that help resolve the conflict in mutually beneficial ways. <br /> <br /> 

                            Strategies of the exchanging information may include: <br /> 
                            •	What are your assumptions, and how are you checking them, and the other person’s? <br /> 
                            •	What common ground is there? What is a shared value, perspective, or difficulty? <br /> 
                            •	What is important for each of you regarding the identified topics? <br /> 
                            •	What is the interpretation of key words, phrases, or other critical information? <br /> 
                            •	What feelings need to be expressed and acknowledged? <br /> 
                            •	How can you be descriptive rather than judgmental? <br /> 
                            •	How can you speak from your perspective in a respectful and assertive way? <br /> 
                            •	When would using silence increase participation or allow you to reflect on what is being exchanged? <br /> 
                            •	What is a summary of what is important to both you and the other parties in this exchange of information? <br /> 

                        </div>
                    </div>

                    <div id='stage4'>
                        <div className= "text-center mt-28 text-2xl text-white font-calibri font-medium">
                            Stage 4: Agreement
                        </div>
                        
                        <div className= "mt-12 mx-24 sm:mx-36 text-medium text-white font-calibri whitespace-pre-line">
                        In reaching an agreement, the parties either decide on a resolution or agree to end the conversation without a resolution. A satisfactory outcome usually includes a resolution of some or all the issues in dispute, and it may even include a change in the relationship between the parties. Resolutions might include decision-making, apologizing, creating a plan, providing restitution, reconciling negative feelings and demonstrations of friendship. <br /> <br />

                        Focus of AGREEMENT <br />
                        During the agreement-building part of the conversation, both people generate as many mutually satisfying solutions to the conflict as possible (based on what is important to them). Then, they select the options that best satisfy their needs (both shared and distinct) that were uncovered in the exchange part of the conversation. The solutions that meet the most needs of both parties will be the best outcome. <br /> <br />

                        Strategies of the agreement part of the conversation may include: <br /> 
                        • What options could meet your expressed needs? <br />
                        • How does each option match up for fairness to ensure that the needs of both parties are met? <br />
                        • What one option, or a combination of options, could work for us? <br />
                        • What’s our action plan: who, what, when, where, how ? <br />
                        • How effective is the solution? <br /> <br />

                        If a solution is still not apparent, try: <br />
                        • How can we create more trust or energy or reduce fear? <br />
                        • How about a break and coming back to the discussion later? <br />
                        • What other information do we need to be able to move forward? <br />
                        </div>
                    </div>

                    <div id='stage5'>
                        <div className= "text-center mt-16 text-2xl text-white font-calibri font-medium">
                            Stage 5: Reflection
                        </div>
                        
                        <div className= "mt-12 mx-24 sm:mx-36 text-medium text-white font-calibri whitespace-pre-line">
                            Check to see how satisfied you both are about the outcomes and the relationship; set follow-up action steps and future check-back opportunities: <br /> <br />
                            
                            Questions that help to reflect on the relationship aspects of the conversation: <br />
                            ·	How well did you connect with the other person in this conversation? <br />
                            ·	What would they say about the way we engaged in the conversation? <br />
                            ·	How will this conversation impact our future relationship? <br /> <br />
                            
                            Questions that focus on the outcome aspects of the conversation: <br />
                            ·	How satisfied are you with the outcomes or agreements you made in this conversation? <br />
                            ·	How satisfied is the other party with the outcomes or agreements you made in this conversation? <br />
                            ·	What would you do differently in the next conversation when you have a disagreement? <br />
                            <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
                        </div>
                    </div>
                </div>

                {/* <div id="inv">
                    <span className="absolute top-[130px] left-[668px] text-white text-3xl font-calibri font-medium"> Stage 1: Invitation </span>
                </div> */}

        </>
    )
}