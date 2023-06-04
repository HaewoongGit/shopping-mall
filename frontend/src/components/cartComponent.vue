<template>
    <div class="wrap">
        <div class="mb-3">
            <h4>
                <i class="fa fa-shopping-cart mr-1" aria-hidden="true"><font-awesome-icon icon="cart-shopping" /></i> 장바구니
            </h4>
        </div>
        <div v-for="(product, i) in cart" :key="i" style="margin-bottom: 10px">
            <div id="goodsList">
                <div class="card mb-2">
                    <div class="row no-gutters">
                        <img :src="product.goods.thumbnailUrl" class="card-img-top col-4" alt="..." style="width: 220px; height: 250px" />
                        <div class="col-8 d-flex align-items-center">
                            <div class="card-body py-1">
                                <div class="card-title row mt-2">
                                    <p class="font-weight-bold col" style="display: inline">{{ product.goods.name }}</p>
                                    <span class="card-price col text-right">${{ product.goods.price }}</span>
                                </div>
                                <div class="card-title row mt-2">
                                    <p class="font-weight-bold col" style="display: inline">장바구니에 담긴 수량</p>
                                    <span class="card-price col text-right">{{ product.quantity }}</span>
                                </div>

                                <div class="row mt-5">
                                    <div class="col-6">
                                        <button @click="cartDeleteAndList(product.goods.goodsId)" type="button" class="btn btn-outline-primary w-100">
                                            삭제
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <select
                                            @change="cartChangeAndList({ quantity: $event.target.value, goodsId: product.goods.goodsId })"
                                            class="form-select"
                                            id="numberSelect"
                                        >
                                            <option selected>변경할 수량 선택</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card" style="text-align: center">
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
        ...mapState(["cart"]),
    },
    methods: {
        ...mapActions(["cartChange", "cartList", "cartDelete"]),
        ...mapMutations(["setTotalPrice", "setShoppingList"]),
        cartPriceSum() {
            let sum = 0;
            for (let i = 0; i < this.cart.length; i++) sum += this.cart[i].quantity * this.cart[i].goods.price;

            this.setTotalPrice(sum);
            return sum;
        },

        cartChangeAndList(data) {
            this.cartChange(data).then(() => {
                this.cartList();
            });
        },

        cartDeleteAndList(data) {
            this.cartDelete(data).then(() => {
                this.cartList();
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
        this.cartList();
    },
};
</script>

<style></style>
