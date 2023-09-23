import axios from "axios";
import App from './App';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;

  }

  handleInterested = () => {
    const message = this.createChatBotMessage(
      "Thank you for your interest! We've notified the video's creator about your willingness to cooperate. They will review the opportunity and make a decision. Rest assured, we'll keep you informed about their response."
    );

    const sendInteraction = () => {
      axios.post(process.env.BASE_URL + "/interaction", {
        recipient_id: App.recipient_id,
        status: 'sent'
      })
        .then(function (response) {
          const { data } = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    sendInteraction();

    this.updateChatbotState(message);
  };


  handleNotInterested = () => {
    const message = this.createChatBotMessage(
      "Thank you for letting us know. If you change your mind, feel free to reach out. Have a great day!",
      // {
      //   widget: "javascriptLinks",
      // }
    );

    const sendInteraction = () => {
      axios.post(process.env.BASE_URL + "/interaction", {
        recipient_id: App.recipient_id,
        status: 'rejected by partner'
      })
        .then(function (response) {
          const { data } = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    sendInteraction();

    this.updateChatbotState(message);
  };

  greet() {
    const greetingMessage = this.createChatBotMessage("You're welcome!")
    this.updateChatbotState(greetingMessage)
  }

  updateChatbotState(message) {

    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;

