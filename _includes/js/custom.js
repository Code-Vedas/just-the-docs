class LongPressClick {
  constructor(element, options = {}) {
    this.element = element;
    this.longPressDuration = options.longPressDuration || 500;
    this.onClickCallback = options.onClick || function () { };
    this.onLongPressCallback = options.onLongPress || function () { };

    this.timer = null;
    this.isLongPress = false;

    // Bind event handlers
    this.startPress = this.startPress.bind(this);
    this.cancelPress = this.cancelPress.bind(this);

    // Add event listeners
    this.element.addEventListener('mousedown', this.startPress);
    this.element.addEventListener('mouseup', this.cancelPress);
  }

  // Function to start the press timer
  startPress(e) {
    e.preventDefault();
    this.isLongPress = false;
    this.timer = setTimeout(() => {
      this.isLongPress = true;
      this.onLongPressCallback();
    }, this.longPressDuration);
  }

  // Function to cancel the timer and handle click/long press
  cancelPress(e) {
    clearTimeout(this.timer);
    if (!this.isLongPress) {
      this.onClickCallback();
    }
  }

  // Cleanup function to remove event listeners
  destroy() {
    this.element.removeEventListener('mousedown', this.startPress);
    this.element.removeEventListener('mouseup', this.cancelPress);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!jtd) { return; }

  const toggleSchemeBtn = document.querySelector('.color-scheme-switch-theme-button');
  const logo = document.querySelector('.site-logo-class');

  function setLightMode() {
    jtd.setTheme('light');
    logo.classList.remove('site-logo-dark');
    logo.classList.add('site-logo-light');
    toggleSchemeBtn.ariaLabel = 'Switch to Dark Mode';
  }

  function setDarkMode() {
    jtd.setTheme('dark');
    logo.classList.remove('site-logo-light');
    logo.classList.add('site-logo-dark');
    toggleSchemeBtn.ariaLabel = 'Switch to Light Mode';
  }

  if (window.matchMedia && !localStorage['jtd-theme']) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode();
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setLightMode();
    }
  } else if (localStorage['jtd-theme']) {
    jtd.setTheme(localStorage['jtd-theme']);
  }

  const longPressClickHandler = new LongPressClick(toggleSchemeBtn, {
    longPressDuration: 600,
    onClick: () => {
      if (jtd.getTheme() === 'dark') {
        localStorage['jtd-theme'] = 'light';
        setLightMode();
      } else {
        localStorage['jtd-theme'] = 'dark';
        setDarkMode();
      }
    },
    onLongPress: () => {
      delete localStorage['jtd-theme'];

      if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setDarkMode();
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          setLightMode();
        }
      } else {
        setLightMode();
      }
    }
  });
});