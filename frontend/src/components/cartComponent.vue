<template>
    <div class="wrap">
        <div class="mb-3">
            <h4>
                <i class="fa fa-shopping-cart mr-1" aria-hidden="true"><font-awesome-icon icon="cart-shopping" /></i>
                장바구니
            </h4>
        </div>
        <div v-for="(cart, i) in cartList" :key="i" style="margin-bottom: 10px">
            <div id="cartList">
                <div class="card">
                    <div class="row g-0 h-100">
                        <div class="col-md-5">
                            <img
                                :src="cart.product.files[0].fileURL"
                                class="img-fluid rounded-start"
                                id="product-image"
                                alt="..."
                            />
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h5 class="card-title mb-1">{{ cart.product.productName }}</h5>
                                    <p class="card-text mb-1">${{ cart.product.price }}</p>
                                </div>
                                <p class="card-text">
                                    <small class="text-muted">장바구니에 담긴 수량: {{ cart.quantity }}</small>
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <button
                                        @click="cartDeleteAndList(cart.product.productId)"
                                        type="button"
                                        class="btn btn-danger btn-sm"
                                    >
                                        삭제
                                    </button>
                                    <div style="width: 150px">
                                        <select
                                            class="form-select form-select-sm"
                                            @change="
                                                cartChangeAndList(cart.product.productId, parseInt($event.target.value))
                                            "
                                        >
                                            <option selected>변경할 수량 선택</option>
                                            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="payCardArea" style="text-align: center">
            <div class="row mt-1 mb-1">
                <div class="col-7"><b>총 상품금액</b></div>
                <div class="col-5" style="text-align: left">
                    <b>$ {{ cartPriceSum() }}</b>
                </div>
            </div>
            <button
                @click="
                    cartToWaitingListForPurchase();
                    $router.push('/buy');
                "
                type="button"
                class="btn btn-primary w-100"
            >
                구매
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            cartChangeValue: [],
        };
    },
    computed: {
        ...mapState(["cartList"]),
    },
    methods: {
        ...mapActions(["cartChange", "loadCartList", "cartDelete"]),
        ...mapMutations(["setTotalPrice", "setWaitingListForPurchase", "setCartList"]),
        cartPriceSum() {
            let sum = 0;
            for (let i = 0; i < this.cartList.length; i++)
                sum += this.cartList[i].quantity * this.cartList[i].product.price;

            this.setTotalPrice(sum);
            return sum;
        },

        cartChangeAndList(productId, quantity) {
            this.cartChange({ productId, quantity })
                .then((response) => {
                    if (response === "success") this.loadCartList();
                })
                .catch((error) => {
                    alert(error.message);
                });
        },

        cartDeleteAndList(productId) {
            this.cartDelete(productId)
                .then((response) => {
                    if (response === "success") {
                        this.loadCartList();
                    }
                })
                .catch((error) => {
                    console.error("cartDelete rejected", error);
                    alert(error.message);
                });
        },

        cartToWaitingListForPurchase() {
            let list = [];
            for (const cart of this.cartList) {
                list.push({
                    productId: cart.product.productId,
                    productName: cart.product.productName,
                    quantity: cart.quantity,
                    price: cart.product.price,
                });
            }
            this.setWaitingListForPurchase(list);
        },
    },
    beforeMount() {
        this.loadCartList();
    },
};
</script>

<style scoped>
#product-image {
    width: 280px;
    height: 230px;
    object-fit: contain;
}
</style>
