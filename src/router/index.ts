import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomePc from "../views/HomePc.vue";
import HomeMobile from "../views/HomeMobile.vue";
import BookDetailPc from "../views/BookDetailPc.vue";
import BookDetailMobile from "../views/BookDetailMobile.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/HomePc",
        name: "HomePc",
        component: HomePc,
    },
    {
        path: "/HomeMobile",
        name: "HomeMobile",
        component: HomeMobile,
    },
    {
        path: "/BookDetailPc",
        name: "BookDetailPc",
        component: BookDetailPc,
    },
    {
        path: "/BookDetailMobile",
        name: "BookDetailMobile",
        component: BookDetailMobile,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
