export const keyEnter = 'Enter';

export const urlWebSocket = 'wss://dgsgppicwa64c.cloudfront.net';

/**
 * 
 */
class Controller {
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
    this.#updateConnectionStatus('Disconnected');
    this.#disabled = true;
    this.#messageInput.placeholder = '';
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
  #keyupHandler = ({ key, target }) => {
    if (key === keyEnter && target.value) {
      this.#sendMessage();
    }
    if( !this.#messageInput.value ) {
      this.#sendButton.disabled = true;
    } else if( this.#sendButton.disabled ) {
      this.#sendButton.disabled = false;
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
        this.#updateUserCount(body)
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
    this.#updateConnectionStatus('Connected');
    this.#messageInput.disabled = false;
    this.#messageInput.placeholder = 'Type your message here...';
    this.#webSocket.send(JSON.stringify({action:'clientOpen'}));
  };

  /**
   * 
   */
  #sendMessage = () => {
    const { value } = this.#messageInput;
    
    if( !value ) return;
    
    this.#webSocket.send(value);
    this.#messageInput.value = '';
    this.#messageInput.focus();
    this.#sendButton.disabled = true;
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
  #updateUserCount = (text) => {
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
    this.#messageInput.addEventListener('keyup', this.#keyupHandler);

    this.#sendButton = document.querySelector('#sendButton');
    this.#sendButton.addEventListener('click', this.#sendMessage);
  }
}

/**
 * 
 */
const controller = new Controller();

export default controller;
