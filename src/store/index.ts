import { createStore } from "vuex";
import axios from "axios";
import router from "@/router";

export default createStore({
    state: {
        books: "",
        updateBooksData: "",
        createBookData: "",
    },
    mutations: {
        SET_BOOKS(state, books) {
            state.books = books;
        },
        SET_UPDATE_BOOK_DATA(state, updateBooksData) {
            state.updateBooksData = updateBooksData;
        },
        SET_CREATE_DATA(state, createBookData) {
            state.createBookData = createBookData;
        },
    },
    actions: {
        async getBooks({ commit }) {
            try {
                const data = await axios.get(process.env.VUE_APP_BOOK_API, {});
                if (data) {
                    commit("SET_BOOKS", data.data["hydra:member"]);
                }
            } catch (error) {
                console.log(error);
            }
        },
        async createBook({ commit }, formState) {
            try {
                const body = {
                    title: formState.book.title,
                    description: formState.book.description,
                    author: formState.book.author,
                    publicationDate: formState.book.publicationDate,
                };
                const data = await axios.post(process.env.VUE_APP_BOOK_API, body);
                if (data) {
                    commit("SET_CREATE_DATA", data.data);
                    router.push({ name: formState.routerName, params: { book: JSON.stringify(data.data) } });
                }
            } catch (error) {
                console.log(error);
            }
        },
        async editBook({ commit }, formState) {
            try {
                const id = formState.book.id.split("/")[2];
                const body = {
                    title: formState.book.title,
                    description: formState.book.description,
                    author: formState.book.author,
                    publicationDate: formState.book.publicationDate,
                };

                const headers = {
                    "Content-Type": "application/merge-patch+json",
                };
                const data = await axios.patch(process.env.VUE_APP_BOOK_API + "/" + id, body, { headers });
                if (data) {
                    commit("SET_UPDATE_BOOK_DATA", data.data);
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    getters: {
        getBookList(state) {
            return state.books;
        },
        getNewEditData(state) {
            return state.updateBooksData;
        },
        getCreateData(state) {
            return state.createBookData;
        },
    },
    modules: {},
});
