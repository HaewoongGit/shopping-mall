<template>
    <div class="container mt-5">
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="productImage" class="form-label">상품 이미지</label>
                <input type="file" class="form-control" id="productImage" @change="handleFileUpload" />
            </div>
            <div class="mb-3">
                <label for="productCategory" class="form-label">상품 카테고리</label>
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
                <input type="text" class="form-control" id="productName" v-model="productName" />
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">상품 가격</label>
                <input type="number" class="form-control" id="price" v-model="price" />
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">상품 설명</label>
                <textarea class="form-control" id="description" v-model="description"></textarea>
            </div>
            <div class="mb-3">
                <label for="tags" class="form-label">상품 태그 (콤마로 구분)</label>
                <input type="text" class="form-control" id="tags" v-model="tags" />
            </div>
            <button type="submit" class="btn btn-primary">제출</button>
        </form>
    </div>
</template>

<script>
import router from "@/router";
import { mapActions } from "vuex";
export default {
    data() {
        return {
            file: null,
            categoryName: "",
            productName: "",
            price: "",
            description: "",
            tags: "",
        };
    },
    methods: {
        ...mapActions(["productRegist"]),
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        submitForm() {
            const productTags = this.tags.split(",").map((tag) => "#" + tag.trim());
            this.productRegist({
                file: this.file,
                categoryName: this.categoryName,
                productName: this.productName,
                price: this.price,
                description: this.description,
                productTags,
            })
                .then(() => {
                    alert("상품 등록이 완료되었습니다!");
                    router.push("/");
                })
                .catch((err) => {
                    alert(err);
                });
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>
