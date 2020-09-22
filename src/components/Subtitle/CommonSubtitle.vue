<template>
    <div class="common-subtitle" :class="{'is-bold':isBold}" :style="{left: left, top: top, width: width}">
        <span class="common-subtitle-i" ></span>
        {{title}}
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
            },
            isBold:{
                type:Boolean,
                default:false
            },
            width: {
                type: String,
                default: '280px'
            },
            left: {
                type: String,
            },
            top: {
                type: String,
            },
        },
    }
</script>
<style lang="scss" scoped>
    .is-bold{
        font-weight: bold;
    }
    .common-subtitle {
        height: 22px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 16px;
        display: flex;
        align-items: center;
        font-stretch: normal;
        letter-spacing: 2px;
        color: #333;
        margin-bottom: 10px;
    }
    .common-subtitle-i {
        width: 8px;
        height: 18px;
        display: inline-block;
        border-radius: 5px;
        background-color: #1890ff;
        margin-right: 10px;
    }
</style>
