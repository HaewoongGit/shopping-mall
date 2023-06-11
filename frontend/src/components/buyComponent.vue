<template>
    <div class="wrap">
        <div class="row">
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
            <div class="d-grid gap-2 mb-3">
                <button @click="requestPay({ recipient, contactNumber, address: address1 + ' ' + address2 })" class="btn btn-primary">
                    $ {{ totalPirceReturn }} 결제
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

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
        ...mapState(["shoppingList", "user", "totalPrice"]),
        totalPirceReturn() {
            let totalPrice = 0;
            this.shoppingList.forEach((product) => {
                totalPrice += product.price;
            });

            this.setTotalPrice(totalPrice);
            console.log("this.totalPrice의 값은?", this.totalPrice);

            return totalPrice;
        },
    },
    methods: {
        ...mapMutations(["setTotalPrice"]),
        ...mapActions(["loadUser", "paymentRequest"]),
        requestPay(data) {
            this.loadUser();
            const IMP = window.IMP;
            IMP.init("imp43415866");

            let information = "";

            for (let i = 0; i < this.shoppingList.length; i++) information += this.shoppingList[i].productName + " " + this.shoppingList[i].quantity + ",";

            IMP.request_pay(
                {
                    pg: "kakaopay",
                    pay_method: "card",
                    // merchant_uid: "ORD20180131-0000011", // 주문번호 겹치면 에러남(주석하면 랜덤으로 생성됨)
                    name: information,
                    amount: this.totalPrice,
                    buyer_email: this.user.email,
                    buyer_name: data.recipient,
                    buyer_tel: data.contactNumber,
                    buyer_addr: data.address,
                },
                (rsp) => {
                    if (rsp.success) {
                        this.paymentRequest({
                            impUid: rsp.imp_uid,
                            amount: rsp.paid_amount,
                            deliveryAddress: rsp.buyer_addr,
                            contactNumber: rsp.buyer_tel,
                            orderInformation: rsp.name,
                        })
                            .then((response) => {
                                if (response === "success") console.log(rsp.name + " 결제 완료!");
                            })
                            .catch((err) => {
                                console.log(err.message);
                                alert(err.message);
                            });
                        alert("결제에 성공했습니다!!");
                    } else {
                        alert("결제에 실패했습니다!! 다시 시도해 주세요!!");
                    }
                }
            );
        },
    },
};
</script>

<style></style>
