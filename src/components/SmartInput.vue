<template>
  <div>
    <p>{{ text }}</p>
    <div class="input-container">
      <input
          :readonly="readonly"
          :value="modelValue"
          @click="() => {if (this.copyableField) copyInputValue(modelValue)}"
          @input="$emit('update:modelValue', $event.target.value)"
      >
      <button v-if="copyButton" @click="copyInputValue(modelValue)">{{texts[lang].copy}}</button>
      <button v-if="clearButton" @click="$emit('update:modelValue', '')">{{ texts[lang].clear}}</button>
      <span :class="{'fade-out':!copied}" style="padding: 0.5em 0 0.5em 0.5em">{{texts[lang].copied}}</span>
    </div>
  </div>
</template>

<script>
import texts from "../texts";

export default {
    name: "CopyableInput",
    computed: {
        texts() {
            return texts
        }
    },
    props: {
        readonly: {
            type: Boolean,
            default: false
        },
        copyableField: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        },
        copyButton: {
            type: Boolean,
            default: false
        },
        clearButton: {
            type: Boolean,
            default: false
        },
        lang: {
            type: String,
            default: 'en'
        }
    },
    data() {
        return {
            copied: false,
            countdown: null
        }
    },
    emits: ['update:modelValue'],
    methods: {
        copyInputValue(val) {
            navigator.clipboard.writeText(val);
            this.copied = true;
            if (this.countdown !== null) {
                clearTimeout(this.countdown);
            }
            this.countdown = setTimeout(() => {
                this.copied = false;
            }, 3000);
        }
    }
}
</script>

<style scoped>
.fade-out {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.input-container {
    display: flex;
    width: max(60%, 24em);
    margin: auto;
    justify-content: space-between;
}

input {
    flex-grow: 12;
}
</style>