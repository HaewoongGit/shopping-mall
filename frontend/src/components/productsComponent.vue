<template>
    <div
        @click="
            productsDetail(this.product.productsId);
            $router.push(`/detail/${product.productsId}`);
        "
        id="productsList"
        class="mb-3"
    >
        <div class="card mb-1" onclick="location.href='#'">
            <div class="row g-0">
                <div class="col-md-4" style="background: #868e96">
                    <img
                        id="productsUrl"
                        src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?w=360"
                        class="img-fluid rounded-start"
                        alt="..."
                    />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <div class="card-title">
                            <h5>{{ product.productName }}</h5>
                            <span class="card-price ml-2">${{ product.price }}</span>
                        </div>
                        <span class="badge text-bg-secondary">{{ product.productCategory.categoryName }}</span>
                        <p class="mt-2">{{ product.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    props: {
        product: Object,
        i: Number,
    },
    methods: {
        ...mapActions(["productsDetail"]),
    },
};
</script>

<style></style>
