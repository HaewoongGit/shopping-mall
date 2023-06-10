<template>
    <div class="wrap">
        <form class="row">
            <h3 class="mb-3"><font-awesome-icon icon="truck-fast" /> <b>배송지 입력</b></h3>
            <div class="col-12 mb-3">
                <label for="recipient" class="form-label">받는 사람</label>
                <input v-model="recipient" type="text" class="form-control" id="recipient" placeholder="홍길동" />
            </div>
            <div class="col-12 mb-3">
                <label for="contactNumber" class="form-label">연락처</label>
                <input v-model="contactNumber" type="text" class="form-control" id="contactNumber" placeholder="010-xxx-xxxx" />
            </div>
            <div class="col-12 mb-3">
                <label for="inputAddress" class="form-label">주소</label>
                <input v-model="address1" type="text" class="form-control mb-2" id="inputAddress" placeholder="도로명, 건물명, 번지" />
                <input v-model="address2" type="text" class="form-control" id="inputAddress2" placeholder="상세주소" />
            </div>
            <!-- <div class="d-grid gap-2 mb-3">
                <button @click="requestPay({ recipient, contactNumber, address: address1 + ' ' + address2, shoppingList, totalPrice })" class="btn btn-primary">
                    $ {{ totalPrice }} 결제
                </button>
            </div> -->
        </form>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            recipient: "",
            contactNumber: "",
            address1: "",
            address2: "",
        };
    },
    computed: {
        ...mapState(["shoppingList"]),
    },
    methods: {
        // ...mapActions(["shoppingListPost"]),
        // requestPay(data) {
        //     const IMP = window.IMP;
        //     IMP.init("imp43415866");
        //     IMP.request_pay({
        //         pg: "kakaopay",
        //         pay_method: "card",
        //         // merchant_uid: "ORD20180131-0000011", // 주문번호 겹치면 에러남(주석하면 랜덤으로 생성됨)
        //         name: "나의 마우스",
        //         amount: 100,
        //         buyer_email: "gildong@gmail.com",
        //         buyer_name: "홍길동",
        //         buyer_tel: "010-4242-4242",
        //         buyer_addr: "서울특별시 강남구 신사동",
        //         buyer_postcode: "01181",
        //     });
        // },
    },
};
</script>

<style></style>
