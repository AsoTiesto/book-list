<template>
    <a-layout class="layout">
        <a-layout-header :style="{ background: '#fff', padding: 0, height: '12vh' }">
            <span>The book shelf</span>
            <a-button class="createBtn"
                      type="primary"
                      :size="size"
                      @click="onOpen">Create</a-button>
        </a-layout-header>
        <a-layout-content style="padding: 50px 50px 50px 50px">
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
                <a-row>
                    <a-col :span="8"
                           class="bookBlock"
                           :style="{borderStyle: 'solid'}"
                           v-for="(item, index) of books">
                        <a-row type="flex"
                               @click="bookHandler(item)">
                            <a-col class="leftBlock"
                                   :flex="2">
                                <img src="https://picsum.photos/800/600"
                                     :style="{height: '200px', width: '200px', float: 'left'}"
                                     alt="">
                            </a-col>
                            <a-col class="rightBlock"
                                   :flex="3"
                                   :style="{ height: '200px', width: '300px'}">
                                <span>Book name :<br>{{item.title}}</span>
                                <br>
                                <span>The author :<br>{{item.author}}</span>
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
             max-width='600'>
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

                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 11 }">
                    <a-button type="primary"
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
            } catch (error) {
                console.log(error);
            }
        },
        async bookHandler(item: any) {
            this.$router.push({
                name: "BookDetailPc",
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

            await this.createBook(this.formState);
        },
        async closeHandler() {
            this.dialogState = false;
        },
    },
});
</script>

<style>
.createBtn {
    float: right;
    margin-top: 20px;
    margin-right: 50px;
}

.bookBlock:hover {
    cursor: pointer;
    border: 5px;
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
}

.close-btn {
    font-size: 16px;
    float: right;
    margin-top: 10px;
    margin-right: 20px;
    cursor: pointer;
}
</style>
