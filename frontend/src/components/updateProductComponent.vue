<template>
    <div class="container mt-5">
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="productImage" class="form-label">이미지 변경</label>
                <input type="file" class="form-control" id="productImage" @change="handleFileUpload" />
            </div>
            <div class="mb-3">
                <label for="productCategory" class="form-label">카테고리 변경</label>
                <select class="form-select" id="productCategory" v-model="categoryName">
                    <option disabled value="">카테고리를 선택해 주세요</option>
                    <option>가전디지털</option>
                    <option>도서</option>
                    <option>식품</option>
                    <option>생활용품</option>
                    <option>문구</option>
                    <option>스포츠</option>
                    <option>의류</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="productName" class="form-label">상품명</label>
                <input
                    type="text"
                    class="form-control"
                    id="productName"
                    v-model="productName"
                    :placeholder="productName"
                />
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">상품 가격</label>
                <input type="number" class="form-control" id="price" v-model="price" :placeholder="price" />
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">상품 설명</label>
                <textarea
                    class="form-control"
                    id="description"
                    v-model="description"
                    :placeholder="description"
                ></textarea>
            </div>
            <div class="mb-3">
                <label for="tags" class="form-label">상품 태그 (콤마로 구분)</label>
                <input type="text" class="form-control" id="tags" v-model="tags" />
            </div>
            <div class="mb-3">
                <label for="stockStatus" class="form-label">재고 여부</label>
                <select class="form-select" id="stockStatus" v-model="isSoldOut">
                    <option :value="false">재고 있음</option>
                    <option :value="true">재고 없음</option>
                </select>
            </div>
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary">상품 변경</button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            file: null,
            productId: "",
            categoryName: "",
            productName: "",
            price: "",
            description: "",
            tags: "",
            isSoldOut: false,
        };
    },
    computed: {
        ...mapState(["product"]),
    },
    methods: {
        ...mapActions(["productUpdate"]),
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        submitForm() {
            let productTags = null;
            if (this.tags !== "") productTags = this.tags.split(",").map((tag) => "#" + tag.trim());

            this.productUpdate({
                file: this.file,
                productId: this.productId,
                categoryName: this.categoryName,
                productName: this.productName,
                price: this.price,
                description: this.description,
                productTags,
                isSoldOut: this.isSoldOut,
            })
                .then(() => {
                    alert("상품 변경이 완료되었습니다!");
                })
                .catch((err) => {
                    alert(err);
                });
        },
    },

    async beforeMount() {
        this.productId = this.product.productId;
        this.categoryName = this.product.categoryName;
        this.productName = this.product.productName;
        this.price = this.product.price;
        this.description = this.product.description;
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>
