<template>
    <div>
        <h1 class="text-center">찜 관리</h1>
        <div v-if="shouldShowDibsList">
            <div class="card" v-for="dibs in dibses" :key="dibs.id">
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
        </div>

        <div v-else class="text-center mt-5">
            <h2>empty</h2>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState(["dibses"]),
        shouldShowDibsList() {
            return this.dibses.length > 0 && this.dibses.some((dibs) => dibs.isDibs === true);
        },
    },

    methods: {
        ...mapActions(["loadDibses", "cartRegist", "updateDibs"]),

        cartRegistAndResult(productId, quantity) {
            this.cartRegist({ productId, quantity })
                .then(() => alert("장바구니에 담았습니다."))
                .catch((err) => alert(err));
        },

        updateDibsAndResult(productId, isDibs) {
            this.updateDibs({ productId, isDibs })
                .then(() => this.loadDibses())
                .catch((err) => alert(err));
        },
    },

    async beforeMount() {
        await this.loadDibses();
    },
};
</script>

<style></style>
