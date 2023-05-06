<template>
  <h1>Too Simple Encrypt</h1>
  *Currently, this tool only ensures secrecy, not integrate or authenticity.
  <h2>Secretly share a key</h2>
  0. One person will click this button so there is 1 Alice and 1 Bob:
  <button @click="isAlice = !isAlice">Switch role</button>
  <div v-if="isAlice">
    <p>You are Alice</p>
    <smart-input
        text="1. Receive box 1 from other and paste it here"
        v-model="bobPublicKeyStr"
        @input="bobPublicKeyStrReceived"></smart-input>
    <smart-input
        text="2. Copy this and sent to other (click to copy)"
        v-model="encryptedSharedKeyStr"
        readonly
        copyable-field></smart-input>
  </div>
  <div v-else>
    <p>You are Bob</p>
    <smart-input
        text="1. Send this to other (click to copy)"
        v-model="publicKeyStr"
        readonly
        copyable-field></smart-input>
    <smart-input
        text="2. Receive box 2 from other and paste it here"
        @input="receiveSharedKey"></smart-input>
  </div>

  <h2>Shared key</h2>
  <smart-input
      text="3. After both has done 1 and 2, this shared key can be saved so next time you can skip above steps by pasting the shared key here:"
      copy-button
      v-model="sharedKeyStr"
      @input="(event) => { updateSharedKey(event.target.value) }"></smart-input>

  <h2>Encrypt/Decrypt with shared key</h2>

  <div>
    <p>To encrypt:</p>
    <smart-input
        text="4e. Put text to encrypt here"
        v-model="msgToEncrypt"
        @input="(event) => { encryptMsg(event.target.value) }"
    ></smart-input>
    <smart-input
        text="5e. Send this to other (click to copy)"
        v-model="encryptedStr"
        copyable-field
        readonly
    ></smart-input>
  </div>

  <div>
    <p>To decrypt:</p>
    <smart-input
        text="4d. Paste encrypt box 5e from other here"
        v-model="msgToDecrypt"
        @input="(event) => { decryptMsg(event.target.value) }"
    ></smart-input>
    <smart-input
        text="5d. Decrypted text (click to copy)"
        v-model="decryptedStr"
        copyable-field
        readonly
    ></smart-input>
  </div>

</template>

<script>
import SmartInput from "@/components/SmartInput.vue";

function ab2str(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)))
}

function str2ab(str) {
    str = atob(str);
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function concatAb(buffer1, buffer2) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}

export default {
    name: 'App',
    components: {
        SmartInput
    },
    data() {
        return {
            isAlice: false, // Alice choose shared key
            keypair: null,
            sharedKey: null,
            publicKeyStr: '',
            bobPublicKeyStr: '',
            encryptedSharedKeyStr: '',
            sharedKeyStr: '',
            msgToEncrypt: '',
            encryptedStr: '',
            msgToDecrypt: '',
            decryptedStr: ''
        }
    },
    async mounted() {
        this.sharedKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );

        this.sharedKeyStr = ab2str(await window.crypto.subtle.exportKey("raw", this.sharedKey));

        this.keypair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );

        this.publicKeyStr = ab2str(await window.crypto.subtle.exportKey('spki', this.keypair.publicKey));
    },
    methods: {
        async bobPublicKeyStrReceived() {
            let importedKey = await window.crypto.subtle.importKey(
                'spki',
                str2ab(this.bobPublicKeyStr), {
                    name: "RSA-OAEP",
                    hash: "SHA-256",
                }, true,
                ["encrypt"]);

            let ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP",
                },
                importedKey,
                await window.crypto.subtle.exportKey('raw', this.sharedKey)
            )

            this.encryptedSharedKeyStr = ab2str(ciphertext);
        },
        async receiveSharedKey(event) {
            let encryptedSharedKeyStr = event.target.value;

            let plaintext = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP",
                },
                this.keypair.privateKey,
                str2ab(encryptedSharedKeyStr)
            )

            this.sharedKeyStr = ab2str(plaintext);

            await this.updateSharedKey(plaintext, true);
        },
        async updateSharedKey(plaintext, isAb = false) {
            if (!isAb) {
                plaintext = str2ab(plaintext)
            }
            this.sharedKey = await window.crypto.subtle.importKey(
                'raw',
                plaintext, {
                    name: "AES-GCM"
                }, true,
                ["encrypt", "decrypt"]);
        },
        async encryptMsg(plaintextStr) {
            let plaintext = (new TextEncoder()).encode(plaintextStr);
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            let ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv
                },
                this.sharedKey,
                plaintext
            );
            this.encryptedStr = ab2str(concatAb(iv.buffer, ciphertext));
        },
        async decryptMsg(ciphertextStr) {
            let ciphertext = str2ab(ciphertextStr);
            let iv = new Uint8Array(ciphertext.slice(0, 12));
            let ciphertextContent = ciphertext.slice(12);
            let plaintext = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv
                },
                this.sharedKey,
                ciphertextContent
            );
            this.decryptedStr = (new TextDecoder()).decode(plaintext);
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    font-size: large;
}

button {
    font-size: large;
    padding: 0.5em;
}

input {
    font-size: large;
    padding: 0.5em;
}
</style>
