<template>
    <div
        class="mb-5 col-10"
        @click="
            setProduct(product);
            $router.push(`/detail/${product.productId}`);
        "
    >
        <div class="card h-100 d-flex flex-row" style="height: 300px; width: 600px">
            <div class="d-flex justify-content-center align-items-center" style="width: 50%">
                <img :src="product.files[0].fileURL" alt="product image" id="product-image" />
            </div>

            <div class="card-body d-flex flex-column justify-content-center ms-3" style="width: 50%">
                <h5 class="card-title">{{ product.productName }}</h5>
                <span v-if="rating !== 0" class="mb-3"
                    ><font-awesome-icon icon="star" style="color: rgb(226, 0, 0)" /> {{ rating }}</span
                >
                <h6 class="card-subtitle mb-2" style="color: #9f0a28; font-weight: bold">{{ product.price }}원</h6>
                <div>
                    <span class="badge bg-primary mb-2">{{ product.productCategory.categoryName }}</span>
                </div>
                <div class="d-flex flex-wrap">
                    <span class="badge bg-secondary me-1 mb-1" v-for="tag in product.productTags" :key="tag.tagName">
                        #{{ tag.tagName }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
    data() {
        return {
            rating: 0,
        };
    },
    props: {
        product: Object,
        i: Number,
    },
    methods: {
        ...mapMutations(["setProduct"]),
        ...mapActions(["loadRating"]),

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
    },

    beforeMount() {
        this.ratingSave();
    },
};
</script>

<style scoped>
#product-image {
    height: 230px;
    max-width: 300px;
    border-radius: 5px;
}
</style>
