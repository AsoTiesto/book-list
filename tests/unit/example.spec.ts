import { shallowMount } from "@vue/test-utils";
import HomePc from "@/view/HomePc.vue";

describe("HomePc.vue", () => {
    it("renders props.msg when passed", () => {
        const msg = "new message";
        const wrapper = shallowMount(HomePc, {
            props: { msg },
        });
        expect(wrapper.text()).toMatch(msg);
    });
});
