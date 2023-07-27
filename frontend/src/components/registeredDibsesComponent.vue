<template>
    <div>
        <h1 class="text-center">찜 관리</h1>
        <div v-if="shouldShowDibsList">
            <div class="card mb-2" v-for="dibs in dibses" :key="dibs.id">
                <div v-if="dibs.isDibs === true" class="card-body">
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img :src="dibs.product.files[0].fileURL" class="img-fluid" alt="Product Image" />
                        </div>
                        <div class="col-5 d-flex flex-column">
                            <h5 class="card-title">{{ dibs.product.productName }}</h5>
                            <p class="card-text">찜한 날짜: {{ dibs.createdAt.split("T")[0] }}</p>
                        </div>
                        <div class="col-3 d-flex flex-column justify-content-center align-items-center">
                            <button
                                @click="cartRegistAndResult(dibs.product.productId, 1)"
                                class="btn btn-primary mb-2"
                            >
                                장바구니 담기
                            </button>
                            <button
                                @click="updateDibsAndResult(dibs.product.productId, false)"
                                class="col-5 btn btn-danger"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center mt-3">
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

        <div v-else class="text-center mt-5">
            <h2>empty</h2>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            page: 1,
            maxPage: 10,
            pages: [],
        };
    },
    computed: {
        ...mapState(["dibses", "dibsesCount"]),
        shouldShowDibsList() {
            return this.dibses.length > 0 && this.dibses.some((dibs) => dibs.isDibs === true);
        },
    },

    methods: {
        ...mapActions(["loadDibses", "cartRegist", "updateDibs", "loadDibsesCount"]),

        cartRegistAndResult(productId, quantity) {
            this.cartRegist({ productId, quantity })
                .then(() => alert("장바구니에 담았습니다."))
                .catch((err) => alert(err));
        },

        updateDibsAndResult(productId, isDibs) {
            this.updateDibs({ productId, isDibs })
                .then(() => this.loadDibses(this.page))
                .catch((err) => {
                    alert(err.message);
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
                this.loadDibses(this.page);
            }
        },
        nextPage() {
            if (this.page < this.maxPage) {
                this.page++;
                this.loadDibses(this.page);
            }
        },
        goToPage(n) {
            this.page = n;
            this.loadDibses(this.page);
        },
    },

    async beforeMount() {
        await this.loadDibsesCount();
        await this.loadDibses(this.page);
        this.maxPage = Math.ceil(this.dibsesCount / 10);
        this.pageButtons();
    },
};
</script>

<style></style>
