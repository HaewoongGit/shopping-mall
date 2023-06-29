<template>
    <div class="container">
        <h1 class="my-3 font-weight-bold">등록한 상품</h1>

        <div v-if="products.length === 0" class="text-center">
            <h2>Empty</h2>
        </div>

        <div v-else>
            <div v-for="(groupedProducts, date) in groupedByDate" :key="date" class="card mb-3">
                <div class="card-header">등록 날짜: {{ date }}</div>

                <div class="card-body">
                    <div
                        v-for="product in groupedProducts"
                        :key="product.productId"
                        class="d-flex align-items-center mb-2 justify-content-between"
                    >
                        <img :src="product.files[0].fileURL" class="product-image" alt="Product Image" />
                        <h5 class="ms-5">{{ product.productName }}</h5>
                        <div class="d-flex justify-content-end align-items-center">
                            <button
                                class="btn btn-primary"
                                @click="
                                    setProduct(product);
                                    $router.push('/updateProduct');
                                "
                            >
                                상품 정보 변경
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
    computed: {
        ...mapState(["userId", "products"]),
        groupedByDate() {
            return this.products.reduce((groups, product) => {
                const date = product.createdAt.split("T")[0];
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(product);
                return groups;
            }, {});
        },
    },

    methods: {
        ...mapActions(["loadProducts"]),
        ...mapMutations(["setProduct"]),
        changeProductInfo(productId) {
            console.log(productId);
        },
    },

    beforeMount() {
        this.loadProducts(this.userId);
    },
};
</script>

<style>
.product-image {
    width: 200px;
    height: 170px;
}
</style>
