<template>
    <div class="wrap">
        <div class="form-group row mb-4" id="category">
            <label for="categorySelect" class="col-form-label w-25">카테고리</label>
            <select @change="loadProducts({ categoryName: $event.target.value })" class="form-select w-75" id="categorySelect">
                <option value="" selected>전체</option>
                <option value="가전디지털">가전디지털</option>
                <option value="도서">도서</option>
                <option value="식품">식품</option>
                <option value="생활용품">생활용품</option>
                <option value="문구">문구</option>
                <option value="스포츠">스포츠</option>
            </select>
        </div>
        <productsComponent v-for="(product, i) in products" :key="i" :product="product" :i="i" />
    </div>
</template>

<script>
import productsComponent from "./productsComponent.vue";
import { mapActions, mapState } from "vuex";
export default {
    components: { productsComponent },
    computed: {
        ...mapState(["products"]),
    },

    methods: {
        ...mapActions(["loadProducts"]),
    },

    beforeMount() {
        this.loadProducts({});
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
</style>
