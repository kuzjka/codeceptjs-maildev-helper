const MailDev = require('maildev');
const chai = require('chai');
const assert = chai.assert;

/**
 * CodeceptJS Helper for local maildev instance. Adds actions to check virtual email box.
 */
class MaildevHelper extends Helper {

  /**
   * Creates helper object
   * @param config  Configuration from CodeceptJS configuration file
   */
  constructor(config) {
    super(config);
    this.port = config.port || 1025;
    this.emails = [];
    this.read = 0;
    this.maildev = null;
    this.addresses = [];
  }

  _after() {
    if (this.maildev) {
      this.maildev.close((err) => {
        if (err) {
          console.error('Can\'t stop maildev: ' + err);
        } else {
          console.debug('Maildev stopped');
        }
      })
    }
  }

  _startMaildev() {
    this.maildev = new MailDev({
      smtp: this.port,
      ip:"127.0.0.1",
      disableWeb: true
    });
    this.maildev.listen((err) => {
      if (err) console.error("Maildev cannot listen on " + this.port + ": " + err);
      else console.debug("Maildev is listening on " + this.port);
    });
    this.maildev.on('new', (email) => {
      console.debug('Recipients: ' + email.to.map(t => t.address).join(', '));
      if (this._checkAddress(email)) {
        console.log('Got new email: ' + email.subject);
        this.emails.push(email);
      }
    });
  }

  _checkAddress(email) {
    for (var i = 0; i < this.addresses.length; i++) {
      for (var j = 0; j < email.to.length; j++) {
        if (this.addresses[i] === email.to[j].address) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Creates virtual mailbox with given address.
   * @param address   Email address
   */
  haveMailbox(address) {
    if (!this.maildev) {
      this._startMaildev();
    }
    this.addresses.push(address);
  }

  /**
   * Grabs next unread email or fails if there are no unread emails.
   * @return Promise with next unread email object (see maildev API).
   */
  grabNextUnreadMail() {
    return new Promise((resolve) => {
      assert.isBelow(this.read, this.emails.length, 'There are no unread emails');
      resolve(this.emails[this.read++]);
    });
  }
}

module.exports = MaildevHelper;
