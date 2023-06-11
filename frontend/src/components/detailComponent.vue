<template>
    <div class="wrapForDetail shadow-lg mt-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-6 pr-3 d-flex align-items-center">
                    <img
                        id="productsUrl"
                        src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?w=360"
                        class="rounded-start"
                        alt="..."
                    />
                </div>
                <div class="col-6 pl-3">
                    <div id="viewCount" class="text-end small">조회수 {{ product.hits }}</div>

                    <h4 id="productName" class="text-start">{{ product.productName }}</h4>

                    <hr class="border-secondary my-2" />

                    <span class="badge bg-primary">{{ product.productCategory.categoryName }}</span>

                    <div id="tagContainer">
                        <span class="badge bg-secondary me-2" v-for="tag in product.productTags" :key="tag.tagName"> #{{ tag.tagName }} </span>
                    </div>

                    <div id="productDescription">{{ product.description }}</div>

                    <span id="productPrice">{{ product.price }}원</span>

                    <div>
                        <label for="numberSelect">수량 &nbsp;&nbsp;</label>
                        <select v-model.number="quantity" class="custom-select" id="numberSelect">
                            <option v-for="number in 10" :key="number" :value="number">{{ number }}개</option>
                        </select>
                    </div>

                    <div>총 상품금액</div>
                    <div id="orderNumber">
                        <small>총 수량 {{ quantity }}개 </small>&nbsp; ${{ Math.round(product.price * quantity) }}
                    </div>

                    <div class="d-flex justify-content-center mt-2">
                        <button
                            v-if="token.length !== 0"
                            @click="cartRegist({ productId: product.productId, quantity })"
                            class="btn btn-outline-primary me-5"
                            data-bs-toggle="modal"
                            data-bs-target="#cartModal"
                        >
                            장바구니
                        </button>
                        <button
                            v-if="token.length !== 0"
                            @click="
                                setShoppingList([
                                    { productId: product.productId, productName: product.productName, quantity, price: product.price * quantity },
                                ]);
                                $router.push('/buy');
                            "
                            class="btn btn-primary"
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
            hasIncreasedHits: false,
        };
    },
    computed: {
        ...mapState(["token", "product"]),
    },
    methods: {
        ...mapActions(["cartRegist", "increaseHits", "loadProduct"]),
        ...mapMutations(["setShoppingList"]),
    },

    async beforeMount() {
        if (!this.hasIncreasedHits) {
            try {
                const res = await this.increaseHits(this.product.productId);
                if (res === "success") {
                    await this.loadProduct(this.product.productId);
                    this.hasIncreasedHits = true;
                }
            } catch (error) {
                alert(error.message);
            }
        }
    },
};
</script>

<style>
.wrapForDetail {
    width: 100%;
    max-width: 750px;
    margin: 10px auto;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
