<template>
    <div class="wrapForDetail mt-5">
        <div class="container mb-4">
            <div class="row align-items-center">
                <div class="col-6 pr-3 d-flex align-items-center">
                    <img id="product-image" :src="product.files[0].fileURL" class="rounded-start" alt="..." />
                </div>
                <div class="col-6 pl-3">
                    <div id="viewCount" class="text-end small">조회수 {{ product.hits }}</div>

                    <!-- <h4 id="productName" class="text-start">{{ product.productName }}</h4> -->
                    <h4 id="productName" class="d-flex justify-content-between align-items-center">
                        <span>{{ product.productName }}</span>
                        <span
                            v-if="token.length !== 0"
                            :style="{
                                color: dibs !== null && dibs.isDibs ? 'red' : 'gray',
                                cursor: 'pointer',
                            }"
                            @click="dibsClick()"
                            >찜 <font-awesome-icon icon="fa-heart"
                        /></span>
                    </h4>
                    <span v-if="rating !== 0" class="mb-3"
                        ><font-awesome-icon icon="star" style="color: rgb(226, 0, 0)" /> {{ rating }}</span
                    >

                    <hr class="border-secondary my-2" />

                    <div id="productDescription" class="mb-3">{{ product.description }}</div>

                    <span class="badge bg-primary">{{ product.productCategory.categoryName }}</span>

                    <div id="tagContainer">
                        <span class="badge bg-secondary me-2" v-for="tag in product.productTags" :key="tag.tagName">
                            #{{ tag.tagName }}
                        </span>
                    </div>

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
                                setWaitingListForPurchase([
                                    {
                                        productId: product.productId,
                                        productName: product.productName,
                                        quantity,
                                        price: product.price,
                                        isCart: false,
                                    },
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

        <hr class="mb-2" style="color: black; border-width: 1.5px" />
        <h4 class="mb-5 d-flex justify-content-center">상품평</h4>

        <div class="review-container mt-3" v-for="(review, index) in reviews" :key="index">
            <div style="font-size: large">{{ review.user.userName }}</div>
            <div class="d-flex align-items-center mb-2">
                <div>
                    <font-awesome-icon
                        v-for="n in 5"
                        :key="n"
                        icon="star"
                        :style="{ color: n <= review.rating ? 'gold' : 'gray' }"
                    />
                </div>
                <div class="ms-2">
                    {{
                        new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            day: "2-digit",
                        })
                    }}
                </div>
            </div>
            <p>{{ review.reviewContent }}</p>
            <hr class="my-3" style="border-color: black" />
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
            rating: 0,
            reviews: [],
        };
    },
    computed: {
        ...mapState(["token", "product", "dibs"]),
    },
    methods: {
        ...mapActions([
            "cartRegist",
            "increaseHits",
            "loadProduct",
            "loadRating",
            "loadProductReviews",
            "loadDibs",
            "dibsOn",
            "updateDibs",
        ]),
        ...mapMutations(["setWaitingListForPurchase"]),
        ratingSave() {
            this.loadRating(this.product.productId)
                .then((res) => {
                    if (res.length === 0) return;
                    let sum = 0;
                    for (const obj of res) {
                        sum += obj.rating;
                    }

                    let result = sum / res.length;

                    this.rating = parseFloat(result.toFixed(2));
                })
                .catch((err) => console.log(err));
        },

        async dibsClick() {
            try {
                if (this.dibs === null) {
                    await this.dibsOn(this.product.productId);
                } else if (this.dibs.isDibs === true) {
                    await this.updateDibs({ productId: this.product.productId, isDibs: false });
                } else {
                    await this.updateDibs({ productId: this.product.productId, isDibs: true });
                }
            } catch (error) {
                alert(error);
            }
        },
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

        await this.ratingSave();
        if (this.token.length !== 0) await this.loadDibs(this.product.productId);
        this.reviews = await this.loadProductReviews(this.product.productId);
    },
};
</script>

<style scoped>
.wrapForDetail {
    width: 100%;
    max-width: 750px;
    margin: 10px auto;
    padding-top: 10px;
    padding-bottom: 10px;
}

#product-image {
    width: 350px;
    height: 280px;
    object-fit: contain;
}
</style>
