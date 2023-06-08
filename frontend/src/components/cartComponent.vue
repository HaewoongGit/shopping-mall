<template>
    <div class="wrap">
        <div class="mb-3">
            <h4>
                <i class="fa fa-shopping-cart mr-1" aria-hidden="true"><font-awesome-icon icon="cart-shopping" /></i> 장바구니
            </h4>
        </div>
        <div v-for="(cart, i) in cartList" :key="i" style="margin-bottom: 10px">
            <div id="cartList">
                <div class="card">
                    <div class="row g-0 h-100">
                        <div class="col-md-4">
                            <img
                                src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?w=360"
                                class="img-fluid rounded-start card-img"
                                alt="..."
                            />
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h5 class="card-title mb-1">{{ cart.product.productName }}</h5>
                                    <p class="card-text mb-1">{{ cart.product.price }}</p>
                                </div>
                                <p class="card-text">
                                    <small class="text-muted">장바구니에 담긴 수량: {{ cart.quantity }}</small>
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <button type="button" class="btn btn-danger btn-sm">삭제</button>
                                    <div style="width: 120px">
                                        <select class="form-select form-select-sm">
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
                    $router.push('/buy');
                    cartToShoppingList(cart);
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
        ...mapMutations(["setTotalPrice", "setShoppingList"]),
        cartPriceSum() {
            let sum = 0;
            for (let i = 0; i < this.cartList.length; i++) sum += this.cartList[i].quantity * this.cartList[i].product.price;

            this.setTotalPrice(sum);
            return sum;
        },

        cartChangeAndList(data) {
            this.cartChange(data).then(() => {
                this.loadCartList();
            });
        },

        cartDeleteAndList(data) {
            this.cartDelete(data).then(() => {
                this.loadCartList();
            });
        },

        cartToShoppingList(data) {
            let list = [];
            for (const product of data) {
                list.push({
                    goodsId: product.goods.goodsId,
                    name: product.goods.name,
                    quantity: product.quantity,
                    price: product.goods.price * product.quantity,
                });
                this.cartDelete(product.goods.goodsId);
            }
            this.setShoppingList(list);
        },
    },
    beforeMount() {
        this.loadCartList();
    },
};
</script>

<style>
.card {
    height: 220px;
}

.card-img {
    object-fit: cover;
    height: 100%;
    width: 100%;
}
</style>
