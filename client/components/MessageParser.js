class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("thank you")) {
      this.actionProvider.greet();
    }

    if (lowerCaseMessage.includes("not interested")) {
      this.actionProvider.handleNotInterested();
    }

    if (lowerCaseMessage.includes("interested") && !lowerCaseMessage.includes("not interested")) {
      this.actionProvider.handleInterested();
    }
  }
}

export default MessageParser;