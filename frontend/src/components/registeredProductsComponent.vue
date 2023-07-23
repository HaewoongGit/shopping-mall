<template>
    <div class="container">
        <h2 class="text-center my-3 font-weight-bold">등록한 상품</h2>

        <div v-if="products.length === 0" class="text-center">
            <h2>Empty</h2>
        </div>

        <div v-else>
            <div v-for="(groupedProducts, date) in groupedByDate" :key="date" class="card mb-5">
                <div class="card-header">등록 날짜: {{ date }}</div>

                <div class="card-body">
                    <div
                        v-for="product in groupedProducts"
                        :key="product.productId"
                        class="d-flex align-items-center mb-2 justify-content-between me-1"
                        id="product"
                    >
                        <img :src="product.files[0].fileURL" class="product-image" alt="Product Image" />
                        <h5 class="ms-5">{{ product.productName }}</h5>
                        <div class="d-flex flex-column justify-content-end align-items-center">
                            <button
                                class="btn btn-primary mb-3"
                                @click="
                                    setProduct(product);
                                    $router.push('/updateProduct');
                                "
                            >
                                상품 정보 변경
                            </button>
                            <button class="btn btn-danger" @click="productDeleteAndResult(product.productId)">
                                상품 삭제
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center">
                <button @click="prevPage" :disabled="page === 1" class="btn btn-outline-primary me-2">
                    <font-awesome-icon icon="fa-solid fa-arrow-left" />
                </button>
                <button
                    v-for="n in pages"
                    :key="n"
                    @click="goToPage(n)"
                    class="btn btn-outline-primary me-1"
                    :class="{ active: n === page }"
                >
                    {{ n }}
                </button>
                <button @click="nextPage" :disabled="page === maxPage" class="btn btn-outline-primary ms-2">
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
    data() {
        return {
            page: 1,
            maxPage: 10,
            pages: [],
        };
    },
    computed: {
        ...mapState(["userId", "products", "productsCount"]),
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
        ...mapActions(["loadProducts", "productDelete", "loadProductsCount"]),
        ...mapMutations(["setProduct"]),

        productDeleteAndResult(productId) {
            this.productDelete(productId)
                .then(() => {
                    this.loadProducts(this.userId);
                    alert("삭제 완료");
                })
                .catch((err) => {
                    alert(err);
                });
        },

        pageButtons() {
            let start = this.page - 5;
            if (start < 1) start = 1;
            let end = start + 9;
            if (end > this.maxPage) end = this.maxPage;
            this.pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },

        prevPage() {
            if (this.page > 1) {
                this.page--;
                this.loadProducts({ userId: this.userId, page: this.page });
            }
        },
        nextPage() {
            if (this.page < this.maxPage) {
                this.page++;
                this.loadProducts({ userId: this.userId, page: this.page });
            }
        },
        goToPage(n) {
            this.page = n;
            this.loadProducts({ userId: this.userId, page: this.page });
        },
    },

    watch: {
        userId: {
            handler(newUserId) {
                this.loadProducts({ userId: newUserId, page: 1 });
            },
            immediate: true,
        },
    },

    async beforeMount() {
        await this.loadProductsCount({ userId: this.userId });
        await this.loadProducts({ userId: this.userId, page: 1 });
        this.maxPage = Math.ceil(this.productsCount / 10);
        this.pageButtons();
    },
};
</script>

<style>
.product-image {
    width: 200px;
    height: 170px;
}

#product {
    border: 1px solid rgb(201, 201, 201);
    border-radius: 5px;
    padding: 5px;
}
</style>
