// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const remote = require("electron").remote;
// electron APIs
        window.appQuit = function() {
          remote.app.exit(0);
        };
// node modules
       window.notify= function notify(msg) {
       return require('node-notifier').notify(msg);
       };
// DOM can be manipulated from here (Refer 
// https://github.com/electron/electron-quick-start/blob/master/preload.js)
