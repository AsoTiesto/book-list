<template>
    <a-layout class="layout">
        <a-layout-header :style="{ background: '#fff'}">
            <span class="headerTitle">The book shelf</span>
            <a-button class="createBtnM"
                      type="primary"
                      :size="size"
                      @click="onOpen">Create</a-button>
        </a-layout-header>
        <a-layout-content>
            <div>
                <a-row>
                    <a-col :span="12"
                           class="bookBlock"
                           :style="{borderStyle: 'solid'}"
                           v-for="(item, index) of books">
                        <a-row type="flex"
                               @click="bookHandler(item)">
                            <a-col class="leftBlock"
                                   :flex="2">
                                <img src="https://picsum.photos/800/600"
                                     :style="{height: '70%', width: '100%'}"
                                     alt="">
                            </a-col>
                            <a-col class="rightBlock"
                                   :flex="5">
                                <span v-show="item.title">Book name :<br>{{item.title}}</span>
                                <br>
                                <span v-show="item.author">The author :<br>{{item.author}}</span>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            <a-button type="primary"
                      :loading="iconLoading"
                      @click="enterIconLoading">
                <template #icon>
                    <PoweroffOutlined />
                </template>
                load more
            </a-button>
        </a-layout-footer>
    </a-layout>

    <GDialog class="dialog-block"
             v-model="dialogState"
             max-width='100%'>
        <div class="close-btn"
             @click="closeHandler">X</div>
        <div class="wrapper">
            <a-form :model="formState"
                    v-bind="layout"
                    name="nest-messages"
                    @finish="onFinish">
                <a-form-item :name="['book', 'title']"
                             label="Name"
                             :rules="[{ required: true }]">
                    <a-input v-model:value="formState.book.title" />
                </a-form-item>

                <a-form-item :name="['book', 'author']"
                             label="Author"
                             :rules="[{ required: true }]">
                    <a-input v-model:value="formState.book.author" />
                </a-form-item>

                <a-form-item :name="['book', 'publicationDate']"
                             label="Pub date"
                             :rules="[{ required: true }]"
                             v-bind="config">
                    <a-date-picker v-model:value="formState.book.publicationDate"
                                   show-time
                                   format="YYYY-MM-DD HH:mm"
                                   value-format="YYYY-MM-DD HH:mm" />
                </a-form-item>

                <a-form-item :name="['book', 'isbn']"
                             label="ISBN">
                    <a-input v-model:value="formState.book.isbn" />
                </a-form-item>

                <a-form-item :name="['book', 'description']"
                             label="Description"
                             :rules="[{ required: true }]">
                    <a-textarea v-model:value="formState.book.description" />
                </a-form-item>

                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 9}">
                    <a-button class="savaBtn"
                              type="primary"
                              html-type="submit"
                              @click="submitHandler">Save</a-button>
                </a-form-item>
            </a-form>
        </div>
    </GDialog>
</template>

<script lang="ts">
import { PoweroffOutlined } from "@ant-design/icons-vue";
import type { SizeType } from "ant-design-vue/es/config-provider";
import { GDialog } from "gitart-vue-dialog";
import { defineComponent, ref, reactive } from "vue";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
    name: "HomeMobile",
    components: {
        PoweroffOutlined,
        GDialog,
    },
    computed: {
        ...mapGetters(["getBookList"]),
    },
    async created() {
        await this.getBooksData();
    },
    setup() {
        const iconLoading = ref();
        const dialogState = ref(false);
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const formState = reactive({
            routerName: "",
            book: {
                title: "",
                author: "",
                publicationDate: "",
                isbn: "",
                description: "",
            },
        });

        const enterIconLoading = () => {
            iconLoading.value = {
                delay: 1000,
            };
            setTimeout(() => {
                iconLoading.value = false;
            }, 6000);
        };
        const onFinish = (values: any) => {
            console.log(values);
        };
        const onOpen = () => {
            dialogState.value = true;
        };

        return {
            loading: ref(false),
            size: ref<SizeType>("large"),
            books: ref(),
            iconLoading,
            dialogState,
            layout,
            formState,
            enterIconLoading,
            onFinish,
            onOpen,
        };
    },
    methods: {
        ...mapActions(["getBooks", "createBook"]),
        async getBooksData() {
            try {
                await this.getBooks();
                // 日期排序 新到舊
                this.books = await this.getBookList.sort(
                    (
                        a: { publicationDate: Date },
                        b: { publicationDate: Date }
                    ) => {
                        return (
                            new Date(b.publicationDate).getTime() -
                            new Date(a.publicationDate).getTime()
                        );
                    }
                );

                console.log(this.books);
            } catch (error) {
                console.log(error);
            }
        },
        async bookHandler(item: any) {
            this.$router.push({
                name: "BookDetailMobile",
                params: { book: JSON.stringify(item) },
            });
        },
        async submitHandler() {
            if (
                this.formState.book.title &&
                this.formState.book.author &&
                this.formState.book.publicationDate &&
                this.formState.book.description
            ) {
                this.dialogState = false;
            } else {
                alert("請檢查必填欄位是否有填寫！");
            }

            this.formState.routerName = "BookDetailMobile";
            await this.createBook(this.formState);
        },
        async closeHandler() {
            this.dialogState = false;
        },
    },
});
</script>

<style>
.createBtnM {
    position: relative;
    left: 120px;
}

.headerTitle {
    position: relative;
    left: 55px;
    margin-top: 2px;
}

.bookBlock:hover {
    cursor: pointer;
    border: 5px;
    margin: 0px auto;
}

.dialog-block {
    height: 600px;
}

.leftBlock {
    /* background: rgb(0, 146, 255, 0.75); */
}

.rightBlock {
    /* background: rgb(100, 43, 55, 1); */
}
.wrapper {
    margin: 0px auto;
    margin-top: 50px;
    width: 55%;
}

.savaBtn {
    margin: 0px auto;
}

.close-btn {
    font-size: 16px;
    float: right;
    margin-top: 10px;
    margin-right: 20px;
    cursor: pointer;
}
</style>
