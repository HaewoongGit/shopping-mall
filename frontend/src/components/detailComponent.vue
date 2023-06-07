<template>
    <div class="wrap-product-detail">
        <div class="row no-gutters">
            <div class="col-sm-5">
                <div class="ratio ratio-4x3">
                    <img
                        id="productsUrl"
                        src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?w=360"
                        class="rounded-start"
                        alt="..."
                    />
                </div>
            </div>
            <div class="col-sm-7 card-body px-3">
                <div class="d-flex justify-content-end" id="productHits">
                    <span class="view-count" style="">조회 {{ detail.hits }}</span>
                </div>
                <div class="flex-fill">
                    <h5 id="productName">{{ detail.productName }}</h5>

                    <div class="d-flex justify-content-between mb-2">
                        <div style="white-space: nowrap">상품 설명</div>
                        <div id="productDescriptionContainer">
                            <div id="productDescription">{{ detail.description }}</div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <div style="white-space: nowrap">가격</div>
                        <span class="card-price" id="productPrice">${{ detail.price }}</span>
                    </div>

                    <div class="form-group row mr-0">
                        <label for="numberSelect" class="col-4 col-form-label">수량</label>
                        <select v-model.number="quantity" class="custom-select col-4" id="numberSelect">
                            <option value="1">1개</option>
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
                            @click="cartRegist({ productId: detail.productId, quantity })"
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
                                setTotalPrice(product.price * quantity);
                                setShoppingList([{ productId: product.productId, name: product.productName, quantity, price: product.price * quantity }]);
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
        ...mapState(["token", "detail"]),
    },
    methods: {
        ...mapActions(["cartRegist"]),
        ...mapMutations(["setShoppingList", "setTotalPrice"]),
    },
};
</script>

<style>
@import "../assets/mystyle.css";
#productPrice {
    display: inline-block;
    text-align: center;
    width: 100%;
}

#productHits {
    margin-right: 20px;
    font-size: 14px;
    color: #323231;
}

#productName {
    margin-bottom: 30px;
    text-align: center;
}

#productDescriptionContainer {
    display: flex;
    justify-content: center;
    width: 100%;
}

#productDescription {
    text-align: center;
}
</style>
