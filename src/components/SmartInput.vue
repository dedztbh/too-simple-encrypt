<template>
  <div>
    <p>{{ text }}</p>
    <input
        :readonly="readonly"
        :value="modelValue"
        @click="() => {if (this.copyableField) copyInputValue(modelValue)}"
        @input="$emit('update:modelValue', $event.target.value)"
    >
    <button v-if="copyButton" @click="copyInputValue(modelValue)">Copy</button>
    <span :class="{'fade-out':!copied}">Copied!</span>
  </div>
</template>

<script>
export default {
    name: "CopyableInput",
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

input {
    min-width: 50%;
}
</style>