import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomePc from "../views/HomePc.vue";
import HomeMobile from "../views/HomeMobile.vue";

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
        component: () => import("../views/BookDetailPc.vue"),
    },
    {
        path: "/BookDetailMobile",
        name: "BookDetailMobile",
        component: () => import("../views/BookDetailMobile.vue"),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
