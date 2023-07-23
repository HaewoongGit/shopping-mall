<template>
    <div class="container">
        <h2 class="text-center fw-bold my-5">리뷰 관리</h2>
        <div v-if="reviews.length === 0" class="text-center">
            <h2>empty</h2>
        </div>
        <div v-else v-for="review in reviews" :key="review.reviewContent" class="mb-5">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img
                        :src="review.product.files[0].fileURL"
                        alt="Product Image"
                        class="me-3"
                        style="width: 100px; height: 75px"
                    />
                    <h5>{{ review.product.productName }}</h5>
                </div>
                <div>
                    <button
                        @click="
                            setReview(review);
                            $router.push('/updateReview');
                        "
                        class="btn btn-primary me-2"
                    >
                        수정
                    </button>
                    <button @click="reviewDeleteAndResult(review.product.productId)" class="btn btn-danger">
                        삭제
                    </button>
                </div>
            </div>
            <hr class="my-3" style="border-color: gray" />
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <font-awesome-icon
                        v-for="n in 5"
                        :key="n"
                        icon="star"
                        :style="{ color: n <= review.rating ? 'gold' : 'gray' }"
                    />
                </div>
                <div>{{ formatDate(review.createdAt) }}</div>
            </div>
            <p class="mt-3">{{ review.reviewContent }}</p>
            <hr class="my-3" style="border-color: black; border-width: 2px" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
    data() {
        return {
            reviews: [],
        };
    },
    methods: {
        ...mapActions(["loadMyReviews", "reviewDelete"]),
        ...mapMutations(["setReview"]),
        formatDate(date) {
            return date.split("T")[0];
        },

        reviewDeleteAndResult(productId) {
            this.reviewDelete(productId)
                .then(() => {
                    this.reviews = this.loadMyReviews();
                    alert("삭제되었습니다.");
                })
                .catch((err) => alert(err));
        },
    },
    async beforeMount() {
        try {
            this.reviews = await this.loadMyReviews();
        } catch (err) {
            alert(err);
        }
    },
};
</script>

<style scoped></style>
