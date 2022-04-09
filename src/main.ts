import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Axios from "axios";
import moment from "moment";
import { plugin as dialogPlugin } from "gitart-vue-dialog";
import { Layout, Button, Row, Col, Form, Input, DatePicker } from "ant-design-vue";

import "ant-design-vue/dist/antd.css";
import "gitart-vue-dialog/dist/style.css";

let app = createApp(App);
app.config.globalProperties.$axios = Axios;
app.config.globalProperties.$moment = moment;
app.use(store);
app.use(router);
app.use(Layout);
app.use(Button);
app.use(Row);
app.use(Col);
app.use(Form);
app.use(Input);
app.use(DatePicker);
app.use(dialogPlugin);

app.mount("#app");
