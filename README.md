# codeceptjs-maildev-helper

[Maildev](https://danfarrelly.nyc/MailDev/) integration for [CodeceptJS](https://codecept.io/).

## Installation

```bash
npm install --save-dev codeceptjs-maildev-helper
```

## Configuration

in codecept.json:

```js
  ...
  "helpers": {
    ...
    "MaildevHelper": {
      "require": "./node_modules/codeceptjs-maildev-helper"
      "port": 12325
    }
  },
  ...
```

`port` is optional. Default value is 1025.

You may run
```bash
codeceptjs def
```
to generate typescript definitions for all installed helpers - this adds code autocompletion to IDEs, which support TypeScript.

## Usage

Configure your application to use local Maildev server (see [Maildev docs](https://github.com/djfarrelly/MailDev/blob/master/README.md#configure-your-project)).

In your CodeceptJS scenario use `I.haveMailbox(address)` to initialize mailbox and `I.grabNextUnreadMail()` to get email object.

For example:

```js
Scenario('test email sending' async (I) => {
  I.haveMailbox('john.doe@example.com');

  I.amOnPage('/sendMeEmail');
  I.fillField('email', 'john.doe@example.com');
  I.click('Send Me Email!');

  const email = await I.grabNextUnreadMail();

  I.say('I have email: ' + email.subject);
});
```

`I.grabNextUnreadMail()` returns `Promise` like all CodeceptJS grabber methods. It resolves to email object, which is used by Maildev and seems to conform [Mailparser](https://nodemailer.com/extras/mailparser/) specification.

You may register more recepient addresses by adding more `I.haveMailbox()` calls.

## License

MIT