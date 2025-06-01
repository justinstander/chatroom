const cssPropertyHeight = 'height';

/**
 * Base view controller class.
 * 
 * @abstract
 */
export class BaseViewController {
  #isLoaded;

  #isComplete;

  /**
   * Document body element's style
   */
  #bodyStyle;

  /**
   * 
   */
  #skipFirstMatchingHeight;

  /**
   * 
   */
  get viewHeight() {
    return Math.floor(window.visualViewport.height);
  }
  set viewHeight(value) {
    this.#bodyStyle?.setProperty(cssPropertyHeight, `${value}px`);
  }

  #domContentLoadedHandler = () => this.loaded();

  #readyStateChangeHandler = () => {
    if (document.readyState === 'complete') {
      this.complete();
    }
  };

  #resizeHandler = () => {
    const height = this.viewHeight;

    if (this.#skipFirstMatchingHeight && (window.innerHeight === height)) {
      this.#skipFirstMatchingHeight = false;
      return;
    }

    this.viewHeight = height;

    this.resize();
  };

  #loadHandler = () => {
    const height = this.viewHeight;

    if (window.innerHeight > height) {
      this.#skipFirstMatchingHeight = true;
    } else {
      this.viewHeight = height;
    }

    this.load();
  }

  #pageshowHandler = () => this.pageShow();

  #beforeunloadHandler = () => this.destroy();

  constructor() {
    this.#bodyStyle = document.body.style;

    window.addEventListener('beforeunload', this.#beforeunloadHandler);
    window.addEventListener('load',this.#loadHandler);
    window.addEventListener('resize', this.#resizeHandler);
    
    document.addEventListener('DOMContentLoaded', this.#domContentLoadedHandler);
    document.addEventListener('readystatechange', this.#readyStateChangeHandler);

    window.addEventListener('pageshow', this.#pageshowHandler);
  }

  #update() {
    if(this.#isLoaded && this.#isComplete) {
      this.ready();
    }
  }

  /**
   * 
   * @abstract
   */
  loaded() {
    this.#isLoaded = true;
    this.#update();
  }

  /**
   * 
   * @abstract
   */
  complete() {
    this.#isComplete = true;
    this.#update();
  }

  init() {
  }

  ready() {
  }

  resize() {
  }

  load() {
  }

  pageShow() {
  }

  destroy() {
    window.removeEventListener('beforeunload', this.#beforeunloadHandler);
    window.removeEventListener('load',this.#loadHandler);
    window.removeEventListener('resize', this.#resizeHandler);
    
    document.removeEventListener('DOMContentLoaded', this.#domContentLoadedHandler);
    document.removeEventListener('readystatechange', this.#readyStateChangeHandler);

    window.removeEventListener('blur',console.log);
    window.removeEventListener('focus',console.log);
    window.removeEventListener('pageshow', this.#pageshowHandler);
  }
}
