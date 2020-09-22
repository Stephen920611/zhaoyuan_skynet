<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key"/>
                <!--<router-view :key="key"/>-->
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        /*watch: {
            $route() {
                this.addTags()
            },
        },*/
        computed: {
            cachedViews() {
                return this.$store.state.tagsView.cachedViews
//                return ['PoorVillageList','PoorVillageDetail','PoorVillageDetailLog','PoorVillageBaseInfo']
            },
           /* provide() {
                return {
                    reload: this.reload
                }
            },*/
            key() {
                return this.$route.path
            },
            isRouterKeepAlive(){
                return this.$route.meta.noCache || true
            },
        },
        data() {
            return {
                isRouterAlive: true,
            }
        },
        mounted() {
//            this.addTags()
        },
        methods: {
            //添加tags标签
            addTags() {
                const {name} = this.$route
                if (name) {
                    this.$store.dispatch('tagsView/addCachedView', this.$route)
                }
                return false
            },
            /*reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                });
            },*/
        }
    }
</script>

<style lang="scss" scoped>
    .app-main {
        /* 50= navbar  50  */
        /*margin-top: 84px;*/
        min-height: calc(100vh - 144px);
        width: 100%;
        /*height: 100%;*/
        position: relative;
        overflow: hidden;
    }

    .fixed-header + .app-main {
        padding-top: 50px;
    }

    .hasTagsView {
        .app-main {
            /* 84 = navbar + tags-view = 50 + 34 */
            min-height: calc(100vh - 84px);
        }

        .fixed-header + .app-main {
            padding-top: 84px;
        }
    }
</style>

<style lang="scss">
    // fix css style bug in open el-dialog
    .el-popup-parent--hidden {
        .fixed-header {
            padding-right: 15px;
        }
    }
</style>
