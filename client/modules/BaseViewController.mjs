/**
 * Base view controller class.
 * 
 * @abstract
 */
export class BaseViewController {
  #isLoaded;

  #isComplete;

  #domContentLoadedHandler = () => this.loaded();

  #readyStateChangeHandler = () => {
    if (document.readyState === 'complete') {
      this.complete();
    }
  };

  #loadHandler = () => console.log('window.load');

  #beforeunloadHandler = () => this.destroy();

  constructor() {
    window.addEventListener('beforeunload', this.#beforeunloadHandler);
    window.addEventListener('load',this.#loadHandler);
    
    document.addEventListener('DOMContentLoaded', this.#domContentLoadedHandler);
    document.addEventListener('readystatechange', this.#readyStateChangeHandler);
  }

  #update() {
    if(this.#isLoaded && this.#isComplete) {
      console.log('dom.ready');
    }
  }

  /**
   * 
   * @abstract
   */
  loaded() {
    console.log('dom.contentLoaded');
    this.#isLoaded = true;
    this.#update();
  }

  /**
   * 
   * @abstract
   */
  complete() {
    console.log('dom.readyState.complete');
    this.#isComplete = true;
    this.#update();
  }

  destroy() {
    window.removeEventListener('beforeunload', this.#beforeunloadHandler);
    window.removeEventListener('load',this.#loadHandler);
    
    document.removeEventListener('DOMContentLoaded', this.#domContentLoadedHandler);
    document.removeEventListener('readystatechange', this.#readyStateChangeHandler);
  }
}
