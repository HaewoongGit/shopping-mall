<template>
    <div class="wrap">
        <div class="form-group row mb-4" id="category">
            <label for="categorySelect" class="col-form-label w-25">카테고리</label>
            <select
                v-model="categoryName"
                @change="handleCategoryChange($event)"
                class="form-select w-75"
                id="categorySelect"
            >
                <option value="" selected>전체</option>
                <option value="가전디지털">가전디지털</option>
                <option value="의류">의류</option>
                <option value="도서">도서</option>
                <option value="식품">식품</option>
                <option value="생활용품">생활용품</option>
                <option value="문구">문구</option>
                <option value="스포츠">스포츠</option>
            </select>
        </div>
        <div class="d-flex flex-column align-items-center">
            <productsComponent v-for="(product, i) in products" :key="i" :product="product" :i="i" />
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
</template>

<script>
import productsComponent from "./productsComponent.vue";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    components: { productsComponent },
    data() {
        return {
            page: 1,
            maxPage: 10,
            categoryName: "",
            pages: [],
        };
    },
    computed: {
        ...mapState(["products", "productsCount"]),
    },

    methods: {
        ...mapActions(["loadProducts", "loadUser", "loadProductsCount"]),
        ...mapMutations(["setToken"]),

        async handleCategoryChange(event) {
            const categoryName = event.target.value;
            await this.loadProducts({ categoryName, page: 1 });
            await this.loadProductsCount({ categoryName });
            this.maxPage = Math.ceil(this.productsCount / 10);
            this.pageButtons();
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
                this.loadProducts({ categoryName: this.categoryName, page: this.page });
            }
        },
        nextPage() {
            if (this.page < this.maxPage) {
                this.page++;
                this.loadProducts({ categoryName: this.categoryName, page: this.page });
            }
        },
        goToPage(n) {
            this.page = n;
            this.loadProducts({ categoryName: this.categoryName, page: this.page });
        },
    },

    async beforeMount() {
        await this.loadProductsCount({});
        await this.loadProducts({ page: 1 });
        this.pageButtons();

        this.maxPage = Math.ceil(this.productsCount / 10);

        window.onload = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (token) {
                this.setToken(token);
                this.loadUser();
            }
        };
    },
};
</script>

<style>
@import "../assets/mystyle.css";

#category {
    width: 60%;
    display: flex;
    justify-content: center;
    margin: 0 auto;
}

.wrap {
    /* border: 1px solid #ccc;
    border-radius: 5px; */
    padding: 10px;
}

.btn.active {
    background-color: #0d6efd;
    color: white;
}
</style>
