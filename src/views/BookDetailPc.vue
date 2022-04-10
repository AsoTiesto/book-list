<template>
    <a-layout class="layout">
        <a-layout-header :style="{ background: '#fff', padding: 0, height: '12vh' }">
            <span class="title">{{bookTitle}}</span>
            <a-button class="editBtn"
                      type="primary"
                      :size="size"
                      @click="editHandler">Edit</a-button>
            <a-button class="backBtn"
                      type="primary"
                      :size="size"
                      @click="backHandler">Back</a-button>
        </a-layout-header>
        <a-layout-content>
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">

                <a-row>
                    <a-col :span="8"
                           class="book-detail-block">
                        <a-row type="flex">
                            <a-col :flex="2">
                                <img src="https://picsum.photos/800/600"
                                     :style="{height: '200px', width: '200px', float: 'left'}"
                                     alt="">
                            </a-col>
                            <a-col class="rightBlock"
                                   :flex="3"
                                   :style="{ height: '200px', width: '280px'}">
                                <span class="book-title">{{bookTitle}}</span>
                                <br>
                                <span>{{bookAuthor}}</span>
                                <br>
                                <span>Published on : {{date}}</span>
                                <br>
                                <span>{{description}}</span>
                                <br>
                                <span>{{isbn}}</span>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>

            </div>
        </a-layout-content>
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
import moment from "moment";
import { defineComponent, ref, reactive } from "vue";
import { mapActions, mapGetters } from "vuex";
import { GDialog } from "gitart-vue-dialog";

export default defineComponent({
    components: {
        PoweroffOutlined,
        GDialog,
    },
    computed: {
        ...mapGetters(["getNewEditData"]),
    },
    async created() {
        await this.showBookData();
    },
    setup() {
        const dialogState = ref(false);
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const formState = reactive({
            book: {
                id: "",
                title: "",
                author: "",
                publicationDate: "",
                isbn: "",
                description: "",
            },
        });

        const onFinish = (values: any) => {
            console.log(values);
        };
        const onOpen = () => {
            dialogState.value = true;
        };
        return {
            bookTitle: ref(),
            bookAuthor: ref(),
            bookData: ref(),
            date: ref(),
            description: ref(),
            isbn: ref(),
            dialogState,
            layout,
            formState,
            onFinish,
            onOpen,
        };
    },
    methods: {
        ...mapActions(["editBook"]),
        async showBookData() {
            const book: any = this.$route.params.book;
            this.bookData = JSON.parse(book);
            this.bookTitle = this.bookData.title;
            this.bookAuthor = this.bookData.author;
            this.date = moment(this.bookData.publicationDate).format(
                "YYYY/MM/DD hh:mm"
            );
            this.description = this.bookData.description;
            this.isbn = this.bookData.isbn;
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

            await this.editBook(this.formState);
            await this.showNewEditData();
        },
        async showNewEditData() {
            this.bookTitle = this.getNewEditData.title;
            this.bookAuthor = this.getNewEditData.author;
            this.date = moment(this.getNewEditData.publicationDate).format(
                "YYYY/MM/DD hh:mm"
            );
            this.description = this.getNewEditData.description;
            this.isbn = this.getNewEditData.isbn;

            this.bookData.title = this.formState.book.title;
            this.bookData.author = this.formState.book.author;
            this.bookData.publicationDate = this.formState.book.publicationDate;
            this.bookData.isbn = this.formState.book.isbn;
            this.bookData.description = this.formState.book.description;
        },
        async editHandler() {
            this.dialogState = true;
            this.formState.book.id = this.bookData["@id"];
            this.formState.book.title = this.bookData.title;
            this.formState.book.author = this.bookData.author;
            this.formState.book.publicationDate = this.bookData.publicationDate;
            this.formState.book.isbn = this.bookData.isbn;
            this.formState.book.description = this.bookData.description;
        },
        async closeHandler() {
            this.dialogState = false;
        },
        async backHandler() {
            this.$router.back();
        },
    },
});
</script>

<style>
.title {
    float: center;
}
.editBtn {
    float: right;
    margin-top: 20px;
    margin-right: 50px;
}

.backBtn {
    float: left;
    margin-top: 20px;
    margin-left: 50px;
}

.book-detail-block {
    margin: 0px auto;
}

.book-title {
    font-size: 18px;
    font-style: normal;
}
</style>
