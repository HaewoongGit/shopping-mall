<template>
    <div class="wrap">
        <div v-for="(orderList, i) in orderHistory" :key="i" id="orderList" class="mb-3">
            <div class="card mb-1" onclick="location.href='#'">
                <div class="row g-0">
                    <div class="col-md-4" style="background: #868e96">
                        <img id="orderListUrl" :src="orderList.thumbnailUrl" class="img-fluid rounded-start" alt="..." />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="card-title">
                                <h5>{{ orderList.name }}</h5>
                                <p class="card-price ml-2 mt-5">주문 수량: {{ orderList.quantity }}</p>
                                <p class="card-price ml-2">가격: ${{ orderList.price }}</p>
                                <p class="card-price ml-2">주문 날짜: {{ orderList.date }}</p>
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
    computed: {
        ...mapState(["orderHistory"]),
        ...mapActions(["orderHistoryGet"]),
    },

    beforeMount() {
        this.orderHistoryGet;
    },
};
</script>

<style>
@import "../assets/mystyle.css";
</style>
