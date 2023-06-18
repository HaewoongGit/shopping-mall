<template>
    <div class="wrap-order-list">
        <h3 class="my-4 mb-5">주문목록</h3>
        <div
            id="outside-card"
            v-for="(orders, uid) in groupedOrders()"
            :key="uid"
            class="row row-cols-1 g-4 bg-light p-2 mb-5"
        >
            <div class="row align-items-center">
                <div class="col-md-4">
                    <h5 class="mb-0">{{ formatDate(orders[0].createdAt) }} 주문</h5>
                </div>
                <div class="col-md-8 d-flex justify-content-end align-items-center">
                    <small class="d-block me-3">
                        배송지:
                        {{ orders[0] && orders[0].deliveryAddress ? orders[0].deliveryAddress : "주소 정보 없음" }}
                    </small>
                    <span v-if="orders[0].deletedAt" style="color: red"> 취소된 주문 </span>
                    <button
                        v-if="!orders[0].deletedAt"
                        @click="cancelAndLoadOrderList(orders[0].payment.merchantUid)"
                        class="btn btn-outline-danger btn-sm"
                    >
                        구매 취소하기
                    </button>
                </div>
            </div>
            <div class="col">
                <div
                    id="inside-card"
                    v-for="order in orders"
                    :key="order.orderListId"
                    class="card mb-2"
                    style="max-height: 153px"
                >
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img
                                src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?w=360"
                                class="img-fluid"
                                alt="..."
                                style="border-radius: 5px"
                            />
                        </div>
                        <div class="col-md-8 d-flex align-items-center">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p>{{ order.product.productName }}</p>
                                        <p>{{ order.price }} 원 x {{ order.orderQuantity }} 개</p>
                                    </div>
                                    <div
                                        class="col-md-6 d-flex justify-content-end"
                                        style="padding-top: 20px; padding-bottom: 20px"
                                    >
                                        <button class="btn btn-primary btn-sm me-2">리뷰 작성하기</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            productList: [],
        };
    },
    methods: {
        ...mapActions(["loadOrderList", "paymentCancel"]),
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        },
        groupedOrders() {
            const result = this.orderList.reduce((grouped, order) => {
                const uid = order.payment.merchantUid;
                if (!grouped[uid]) grouped[uid] = [];

                grouped[uid].push(order);

                return grouped;
            }, {});

            return result;
        },
        cancelAndLoadOrderList(marchantUid) {
            this.paymentCancel(marchantUid)
                .then((res) => {
                    if (res === "success") {
                        alert("주문이 취소되었습니다.");
                        this.loadOrderList();
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        },
    },
    computed: {
        ...mapState(["orderList"]),
    },

    beforeMount() {
        this.loadOrderList();
    },
};
</script>

<style>
@import "../assets/mystyle.css";

.wrap-order-list {
    max-width: 700px;
    margin: 10px auto;
}

#outside-card {
    border: 1px solid #ccc;
    border-radius: 10px;
}
</style>
