import { BaseViewController } from './BaseViewController.mjs';

export const keyEnter = 'Enter';

export const urlWebSocket = 'wss://dgsgppicwa64c.cloudfront.net';

/**
 * 
 */
class Controller extends BaseViewController {
  #userCount;
  #connectionStatus;
  #messageInput;
  #messages;
  #sendButton;
  #webSocket;

  /**
   * 
   * @param {boolean} disabled 
   */
  set #disabled(disabled) {
    this.#messageInput.disabled = disabled;
    this.#sendButton.disabled = disabled;
  }

  /**
   * 
   * @returns undefined
   */
  #closeHandler = () => {
    this.#updateConnectionStatus('Connection Closed.');
    this.#disabled = true;
  }

  /**
   * 
   */
  #errorHandler = () => {
    this.#disabled = true;
    this.#writeMessage('Error.');
  }

  /**
   * 
   * @param {{key, target}} event
   */
  #keydownHandler = ({ key, target }) => {
    if (key === keyEnter && target.value) {
      this.#sendMessage();
    }
  }

  /**
   * 
   * @param {{data}} event
   * @returns 
   */
  #messageHandler = ({ data }) => {
    if (!data) return;

    const { type, body } = JSON.parse(data);
    switch (type) {
      case 'message':
        this.#writeMessage(body);
        break;
      case 'count':
        this.#updateUserAccount(body)
        break;
      default:
        break;
    }
  }

  /**
   * 
   * @returns 
   */
  #openHandler = () => {
    this.#updateConnectionStatus('Connection Open.');
    this.#disabled = false;
    this.#webSocket.send(JSON.stringify({action:'clientOpen'}))
  };

  /**
   * 
   */
  #sendMessage = () => {
    this.#webSocket.send(this.#messageInput.value);
    this.#messageInput.value = '';
  };

  /**
   * 
   * @param {string} text 
   */
  #updateConnectionStatus = (text) => {
    this.#connectionStatus.innerText = text;
  }

  /**
   * 
   * @param {*} text 
   */
  #updateUserAccount = (text) => {
    this.#userCount.innerText = text;
  }

  /**
   * 
   * @param {string} message 
   */
  #writeMessage = (message) => {
    const span = document.createElement('span');
    span.textContent = message;
    this.#messages.append(span);

    const main = document.querySelector('main');
    main.scrollTo(0, main.scrollHeight);
  };

  /**
   * 
   */
  init() {
    this.#connectionStatus = document.querySelector('#connectionStatus');
    this.#userCount = document.querySelector('#userCount');
    this.#messages = document.querySelector('main article section');

    this.#webSocket = new WebSocket(urlWebSocket);
    this.#webSocket.addEventListener("open", this.#openHandler);
    this.#webSocket.addEventListener("close", this.#closeHandler);
    this.#webSocket.addEventListener("message", this.#messageHandler);
    this.#webSocket.addEventListener("error", this.#errorHandler);

    this.#messageInput = document.querySelector('#messageInput');
    this.#messageInput.addEventListener('keydown', this.#keydownHandler);

    this.#sendButton = document.querySelector('#sendButton');
    this.#sendButton.addEventListener('click', this.#sendMessage);
  }
}

/**
 * 
 */
const controller = new Controller();

export default controller;
