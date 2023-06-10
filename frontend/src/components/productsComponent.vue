<template>
    <div
        class="mb-5"
        @click="
            setProduct(product);
            $router.push(`/detail/${product.productId}`);
        "
    >
        <div class="card h-100 d-flex flex-row">
            <img
                src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?w=360"
                class="card-img-left flex-shrink-0"
                alt="product image"
            />
            <div class="card-body">
                <h5 class="card-title">{{ product.productName }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${{ product.price }}</h6>
                <span class="badge bg-primary">{{ product.productCategory.categoryName }}</span>
                <p class="card-text">{{ product.description }}</p>
                <div class="d-flex flex-wrap">
                    <span class="badge bg-secondary me-2" v-for="tag in product.productTags" :key="tag.tagName"> #{{ tag.tagName }} </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    props: {
        product: Object,
        i: Number,
    },
    methods: {
        ...mapMutations(["setProduct"]),
    },
};
</script>

<style>
.card-img-top {
    object-fit: cover;
    height: 100%;
    width: auto;
}
</style>
