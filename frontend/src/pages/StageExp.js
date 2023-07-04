import React, { useState } from 'react';
import LeftSideBar from '../components/LeftSideBar';

// TODO: Make a page that explains all the stages in detail
export default function StageExp() {
    const [clickedButton, setClickedButton] = useState(false);

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
                <LeftSideBar />

                <div className= "grid grid-rows-10 fixed h-screen top-0 right-0 w-4/5 bg-black justify-center overflow-y-scroll">
                    <div className="mt-6 mx-64">
                        <ul className="fixed grid grid-cols-5 bg-[#ffffff33] justify-items-center items-center rounded-xl w-[800px] h-14">
                        <li>
                        <button className={`text-lg ${clickedButton === 'stage1' ? 'bg-[#9adbff] text-black font-bold rounded-lg px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage1')}>
                                Invitation
                        </button>
                        </li>
                        <li>
                        <button className={`text-lg ${clickedButton === 'stage2' ? 'bg-[#9adbff] text-black font-bold rounded-lg px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage2')}>
                                Connection
                        </button>
                        </li>
                        <li>
                        <button className={`text-lg ${clickedButton === 'stage3' ? 'bg-[#9adbff] text-black font-bold rounded-lg px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage3')}>
                                Exchange
                        </button>
                        </li>
                        <li>
                        <button className={`text-lg ${clickedButton === 'stage4' ? 'bg-[#9adbff] text-black font-bold rounded-lg px-8 py-2' : 'text-[#c6c6c6]'}`}
                            onClick={() => handleButtonClick('stage4')}>
                                Agreement
                        </button>
                        </li>
                        <li>
                        <button className={`text-lg ${clickedButton === 'stage5' ? 'bg-[#9adbff] text-black font-bold rounded-lg px-8 py-2' : 'text-[#c6c6c6]'}`}
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
                        
                        <div className= "mt-12 mx-64 text-medium text-white font-calibri whitespace-pre-line">
                        In reaching an agreement, the parties either decide on a resolution or agree to end the conversation without a resolution. A satisfactory outcome usually includes a resolution of some or all the issues in dispute, and it may even include a change in the relationship between the parties. Resolutions might include decision-making, apologizing, creating a plan, providing restitution, reconciling negative feelings and demonstrations of friendship. <br /> <br />

                        Focus of INVITATION <br />
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

                    <div id='stage2'>
                        <div className= "text-center mt-28 text-2xl text-white font-calibri font-medium">
                            Stage 2: Connection
                        </div>
                        
                        <div className= "mt-12 mx-64 text-medium text-white font-calibri whitespace-pre-line">
                        In reaching an agreement, the parties either decide on a resolution or agree to end the conversation without a resolution. A satisfactory outcome usually includes a resolution of some or all the issues in dispute, and it may even include a change in the relationship between the parties. Resolutions might include decision-making, apologizing, creating a plan, providing restitution, reconciling negative feelings and demonstrations of friendship. <br /> <br />

                        Focus of CONNECTION <br />
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

                    <div id='stage3'>
                        <div className= "text-center mt-28 text-2xl text-white font-calibri font-medium">
                            Stage 3: Exchange
                        </div>
                        
                        <div className= "mt-12 mx-64 text-medium text-white font-calibri whitespace-pre-line">
                        In reaching an agreement, the parties either decide on a resolution or agree to end the conversation without a resolution. A satisfactory outcome usually includes a resolution of some or all the issues in dispute, and it may even include a change in the relationship between the parties. Resolutions might include decision-making, apologizing, creating a plan, providing restitution, reconciling negative feelings and demonstrations of friendship. <br /> <br />

                        Focus of EXCHANGE <br />
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

                    <div id='stage4'>
                        <div className= "text-center mt-28 text-2xl text-white font-calibri font-medium">
                            Stage 4: Agreement
                        </div>
                        
                        <div className= "mt-12 mx-64 text-medium text-white font-calibri whitespace-pre-line">
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
                        <div className= "text-center mt-24 text-2xl text-white font-calibri font-medium">
                            Stage 5: Reflection
                        </div>
                        
                        <div className= "mt-12 mx-64 text-medium text-white font-calibri whitespace-pre-line">
                        In reaching an agreement, the parties either decide on a resolution or agree to end the conversation without a resolution. A satisfactory outcome usually includes a resolution of some or all the issues in dispute, and it may even include a change in the relationship between the parties. Resolutions might include decision-making, apologizing, creating a plan, providing restitution, reconciling negative feelings and demonstrations of friendship. <br /> <br />

                        Focus of REFLECTION <br />
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
                        <br /> <br /> <br /> <br />
                        </div>
                    </div>
                </div>


                {/* <div id="inv">
                    <span className="absolute top-[130px] left-[668px] text-white text-3xl font-calibri font-medium"> Stage 1: Invitation </span>
                </div> */}

        </>
    )
}