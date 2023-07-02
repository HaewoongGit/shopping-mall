<template>
    <div class="wrap">
        <div>
            <h2 class="mb-3">상품 리뷰 수정</h2>
            <hr class="mb-4" />
            <div class="d-flex mb-4">
                <img :src="review.product.files[0].fileURL" alt="Product image" id="product-image" class="me-3" />
                <div class="product-info d-flex flex-column justify-content-center">
                    <h5>{{ review.product.productName }}</h5>
                    <small>별점을 매겨주세요.</small>
                    <div class="rating">
                        <font-awesome-icon
                            v-for="(star, index) in 5"
                            :key="index"
                            icon="star"
                            :class="{ checked: index < rating }"
                            @click="setRating(index + 1)"
                        />
                    </div>
                </div>
            </div>
            <hr class="mb-4" />
            <div class="mb-4">
                <h5 class="mb-3">상세 리뷰</h5>
                <textarea
                    class="form-control"
                    v-model="reviewContent"
                    style="height: 180px"
                    :placeholder="review.reviewContent"
                ></textarea>
            </div>
            <hr class="mb-4" />
            <div class="d-flex justify-content-center">
                <button @click="submitReview(review.product.productId, reviewContent)" class="btn btn-primary">
                    리뷰 변경
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            rating: 0,
            reviewContent: "",
        };
    },
    methods: {
        ...mapActions(["reviewUpdate"]),
        submitReview(productId, reviewContent) {
            if (this.rating === 0) {
                alert("별점을 매겨주세요!");
                return;
            }
            this.reviewUpdate({ productId, reviewContent, rating: this.rating })
                .then((response) => {
                    if (response === "success") alert("리뷰 변경 완료");
                })
                .catch((error) => {
                    alert(error.message);
                });
        },
        setRating(rating) {
            this.rating = rating;
        },
    },
    computed: {
        ...mapState(["review"]),
    },
};
</script>

<style scoped>
.wrap {
    max-width: 630px;
    margin: 10px auto;
}

#product-image {
    width: 230px;
    height: 190px;
}
.rating {
    font-size: 24px;
    color: grey;
}
.rating .checked {
    color: orange;
}
</style>
