import { jsPDF } from 'jspdf';

// Returns a formatted string of all the messages within a stage
const getStageMessages = (stageMsgs) => {
  let output = '';
  if (stageMsgs.length === 0) {
      return '*not started*\n\n'
  }
  for (let msg of stageMsgs) {
      if (msg.type === 'newStage') {
          continue;
      }
      msg.type === 'user' ? output += 'You: ' : output += 'Coach: ';
      output += `${msg.message}\n\n`;
  }
  return output;
}

// Returns a formatted string of all of the messages in the conversation
const formatData = (messages) => {
  let output = '-- INVITATION STAGE --\n\n';
  output += getStageMessages(messages['invitation']);
  output += '\n\n-- CONNECTION STAGE --\n\n';
  output += getStageMessages(messages['connection']);
  output += '\n\n-- EXCHANGE STAGE --\n\n';
  output += getStageMessages(messages['exchange']);
  output += '\n\n-- AGREEMENT STAGE --\n\n';
  output += getStageMessages(messages['agreement']);
  output += '\n\n-- REFLECTION STAGE --\n\n';
  output += getStageMessages(messages['reflection']);
  console.log(output);
  return output;
}
  
export const downloadChatPDF = (messages) => {
  let chat = formatData(messages);

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;

  const wrappedText = doc.splitTextToSize(chat, 235);
  doc.setFontSize(12);
  let iterations = 1;
  const margin = 15; //top and botton margin in mm
  const defaultYJump = 5; // default space btwn lines

  wrappedText.forEach((line) => {
      let posY = margin + defaultYJump * iterations++;
      if (posY > pageHeight - margin) {
          doc.addPage();
          iterations = 1;
          posY = margin + defaultYJump * iterations++;
      }
      doc.text(15, posY, line);
  });

  doc.save("chat.pdf");
}

export const downloadChatTXT = (messages) => {
  let chat = formatData(messages);

  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(chat));
  link.setAttribute('download', `chat.txt`);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const sendEmail = (messages) => {
  downloadChatPDF(messages);

  setTimeout(() => {
    const emailSubject = encodeURIComponent("My Chat History");
    const emailBody = encodeURIComponent("Hi, thanks for using Chat IT Out! \n\nPlease find attached my chat history.\n\nNote: Due to privacy limit, please manually attach the 'chat.pdf' file from your downloads.");
    const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;
    alert("Your email client has been opened. Please attach the 'chat.pdf' file from your downloads.");
  }, 5000);
}

export const timeString = (time) => {
  time = new Date(time)
  let hours = time.getHours();
  let mins = time.getMinutes();
  let minsString = mins < 10 ? `0${mins}` : `${mins}`;
  let timeOfDay = hours < 12 ? 'am' : 'pm';
  hours = hours % 12 || 12;

  let month = time.toLocaleString('default', { month: 'short' });
  let day = time.getDate();
  let year = time.getFullYear();

  return `${hours}:${minsString}${timeOfDay} ${month} ${day}, ${year}`;
}