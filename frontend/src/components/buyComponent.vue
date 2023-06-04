<template>
    <div class="wrap">
        <form class="row">
            <h3 class="mb-3"><font-awesome-icon icon="truck-fast" /> <b>배송지 입력</b></h3>
            <div class="col-12 mb-3">
                <label for="recipient" class="form-label">받는 사람</label>
                <input v-model="recipient" type="text" class="form-control" id="recipient" placeholder="홍길동" />
            </div>
            <div class="col-12 mb-3">
                <label for="contactInformation" class="form-label">연락처</label>
                <input v-model="contactInformation" type="text" class="form-control" id="contactInformation" placeholder="010-xxx-xxxx" />
            </div>
            <div class="col-12 mb-3">
                <label for="inputAddress" class="form-label">주소</label>
                <input v-model="address1" type="text" class="form-control mb-2" id="inputAddress" placeholder="도로명, 건물명, 번지" />
                <input v-model="address2" type="text" class="form-control" id="inputAddress2" placeholder="상세주소" />
            </div>
            <div class="d-grid gap-2 mb-3">
                <button
                    @click="buyAndToMain($event, { recipient, contactInformation, address: address1 + ' ' + address2, shoppingList, totalPrice })"
                    class="btn btn-primary"
                >
                    $ {{ totalPrice }} 결제
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import router from "@/router";

export default {
    data() {
        return {
            recipient: "",
            contactInformation: "",
            address1: "",
            address2: "",
        };
    },
    computed: {
        ...mapState(["totalPrice", "shoppingList"]),
    },
    methods: {
        ...mapActions(["shoppingListPost"]),
        buyAndToMain(event, data) {
            event.preventDefault();
            this.shoppingListPost(data)
                .then((res) => {
                    if (res === "success") {
                        alert("구매 완료");
                        router.push("/");
                    }
                })
                .catch((error) => {
                    alert(error.response.data);
                });
        },
    },
};
</script>

<style></style>
