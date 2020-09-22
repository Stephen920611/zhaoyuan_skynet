<template>
    <div class="common-subtitle" :class="{'is-bold':isBold}">
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
            }
        },
    }
</script>
<style lang="scss" scoped>
    .is-bold{
        font-weight: bold;
    }
    .common-subtitle {
        padding: 10px 0;
        font-size: 20px;
        border-bottom: 1px solid #eee;
        background-color: #fff;
        color: rgba(0,0,0,0.75);
    }
    .common-subtitle-i {
        width: 8px;
        height: 25px;
        background: #2794e7;
        display: inline-block;
        margin: -5px 10px;
    }
</style>
