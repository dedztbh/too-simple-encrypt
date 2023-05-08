# too-simple-encrypt

Too Simple Encrypt is a super simple tool to encrypt text to send over insecure channels for everyone.

图森破加密是一个超简单的文本加密工具，使其可以通过不安全的渠道发送。

## Go to this link to use the tool
可以用以下链接使用本工具

https://dedztbh.github.io/too-simple-encrypt/

You can also install it as an offline app on mobile. Visit the link above and click the install button in your browser menu.

你也可以把它作为一个离线应用程序安装在手机上。访问上述链接并点击浏览器菜单中的安装按钮。

## Technical Detail

We first use asymmetric encryption (2048-bit RSA-OAEP with SHA-256) to share a shared key (256-bit AES-CGM).
Then the shared key is used to encrypt/decrypt text (using a new cryptographically strong random IV for each encryption).

Please note that there is no guarantee that this program is 100% unbreakable.

## Note on https

This tool only works when using https. 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
