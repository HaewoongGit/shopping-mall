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
                <input
                    v-model="contactNumber"
                    type="text"
                    class="form-control"
                    id="contactNumber"
                    placeholder="010xxxxxxxx"
                />
            </div>
            <div class="col-12 mb-3">
                <label for="inputAddress" class="form-label">주소</label>
                <input
                    v-model="address1"
                    type="text"
                    class="form-control mb-2"
                    id="inputAddress"
                    placeholder="도로명, 건물명, 번지"
                />
                <input v-model="address2" type="text" class="form-control" id="inputAddress2" placeholder="상세주소" />
            </div>
            <div class="d-grid mb-3 justify-content-center">
                <button
                    @click="requestPay({ recipient, contactNumber, address: address1 + ' ' + address2 })"
                    class="btn btn-primary"
                >
                    $ {{ totalPirceReturn }} 결제
                </button>
                <div class="text-center">
                    <small style="color: gray">PG사 테스트 연동만 돼있으므로 실제로 결제되진 않습니다!</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { SweetAlert } from "sweetalert2";

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
        ...mapState(["waitingListForPurchase", "user", "totalPrice"]),
        totalPirceReturn() {
            let totalPrice = 0;
            this.waitingListForPurchase.forEach((product) => {
                totalPrice += product.price * product.quantity;
            });

            this.setTotalPrice(totalPrice);

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

            for (let i = 0; i < this.waitingListForPurchase.length; i++)
                information +=
                    this.waitingListForPurchase[i].productName + " " + this.waitingListForPurchase[i].quantity + ",";

            IMP.request_pay(
                {
                    pg: "kakaopay",
                    pay_method: "card",
                    // merchant_uid 없으면 자동으로 생성함
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
                            waitingListForPurchase: this.waitingListForPurchase,
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            amount: rsp.paid_amount,
                            deliveryAddress: rsp.buyer_addr,
                            contactNumber: rsp.buyer_tel,
                            orderInformation: rsp.name,
                        })
                            .then((response) => {
                                if (response === "success") {
                                    SweetAlert.fire({
                                        title: rsp.name + " 결제 완료!",
                                        text: "결제가 완료되었습니다.",
                                        icon: "success",
                                        closeOnConfirm: true,
                                    });
                                    this.$router.push("/");
                                }
                            })
                            .catch((err) => {
                                alert(err.message);
                            });
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
