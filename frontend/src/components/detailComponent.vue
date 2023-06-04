<template>
    <div class="wrap">
        <div class="row no-gutters">
            <div class="col-sm-5">
                <img :src="detail.thumbnailUrl" alt="..." id="goodsUrl" />
            </div>
            <div class="col-sm-7 card-body px-3">
                <div class="flex-fill mt-3">
                    <div class="d-flex justify-content-between mb-3">
                        <h5 style="display: inline" id="goodsName">{{ detail.name }}</h5>
                        <span class="card-price" id="goodsPrice">${{ detail.price }}</span>
                    </div>

                    <div class="form-group row mr-0">
                        <label for="numberSelect" class="col-4 col-form-label">수량</label>
                        <select @change="quantity = $event.target.value" class="custom-select col-8" id="numberSelect">
                            <option selected value="1">1개</option>
                            <option value="2">2개</option>
                            <option value="3">3개</option>
                            <option value="4">4개</option>
                            <option value="5">5개</option>
                        </select>
                    </div>
                    <hr />
                    <div class="row mb-3">
                        <div class="col-5">총 상품금액</div>
                        <div class="col-7 text-right" id="orderNumber">
                            <small class="mr-2 text-muted">총 수량 {{ quantity }}개 </small>&nbsp; ${{ (detail.price * quantity).toFixed(1) }}
                        </div>
                    </div>
                    <div class="d-flex justify-content-around">
                        <button
                            v-if="token.length !== 0"
                            @click="cartRegister(quantity)"
                            type="button"
                            class="btn btn-outline-primary col-5"
                            data-bs-toggle="modal"
                            data-bs-target="#cartModal"
                        >
                            장바구니
                        </button>
                        <button
                            v-if="token.length !== 0"
                            @click="
                                setTotalPrice(detail.price * quantity);
                                setShoppingList([{ goodsId: detail.goodsId, name: detail.name, quantity, price: detail.price * quantity }]);
                                $router.push('/buy');
                            "
                            type="button"
                            class="btn btn-primary col-5"
                        >
                            바로 구매
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <cartModal :quantity="quantity * 1" />
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import cartModal from "../components/cartModal.vue";

export default {
    components: {
        cartModal,
    },
    data() {
        return {
            quantity: 1,
        };
    },
    computed: {
        ...mapState(["detail", "token"]),
    },
    methods: {
        ...mapActions(["cartRegister"]),
        ...mapMutations(["setShoppingList", "setTotalPrice"]),
    },
};
</script>

<style>
@import "../assets/mystyle.css";
</style>
