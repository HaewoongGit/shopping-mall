<template>
    <!-- 상단바 코드 -->
    <nav class="navbar navbar-expand-lg bg-topBar">
        <div class="container-fluid">
            <a
                class="navbar-brand"
                @click="
                    keywordReset();
                    productsReset();
                    $router.push('/');
                "
                style="cursor: pointer"
                ><img src="./assets/shopping.png" width="30" height="30" /> 아는 사람만 아는 스토어</a
            >

            <div class="d-flex justify-content-center" id="search-box">
                <input
                    v-model="inputKeyword"
                    class="form-control me-1"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    style="width: 300px"
                />
                <button @click="searchAndResult(inputKeyword)" class="btn btn-outline-success" type="submit">
                    <font-awesome-icon icon="fa-magnifying-glass" />
                </button>
            </div>

            <div>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav justify-content-end">
                        <li class="nav-item">
                            <a
                                v-if="token.length !== 0"
                                @click="$router.push('/createProduct')"
                                class="nav-link active"
                                style="cursor: pointer"
                                aria-current="page"
                                ><font-awesome-icon icon="fa-plus" /> 상품 등록</a
                            >
                        </li>
                        <li class="nav-item">
                            <a
                                v-if="token.length !== 0"
                                @click="$router.push('/orderList')"
                                class="nav-link active"
                                style="cursor: pointer"
                                aria-current="page"
                                ><font-awesome-icon icon="bag-shopping" /> 주문 목록</a
                            >
                        </li>
                        <li class="nav-item">
                            <a
                                v-if="token.length !== 0"
                                @click="$router.push('/cart')"
                                class="nav-link active"
                                style="cursor: pointer"
                                aria-current="page"
                                ><font-awesome-icon icon="cart-shopping" /> 장바구니</a
                            >
                        </li>
                        <li class="nav-item">
                            <a
                                v-if="token.length !== 0"
                                @click="$router.push('/userInfo')"
                                class="nav-link active"
                                style="cursor: pointer"
                                aria-current="page"
                                ><font-awesome-icon icon="fa-user" /> 내 정보</a
                            >
                        </li>
                        <li class="nav-item">
                            <a
                                v-if="token.length === 0"
                                class="nav-link active"
                                style="cursor: pointer"
                                data-bs-toggle="modal"
                                data-bs-target="#logInModal"
                                ><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> 로그인</a
                            >
                            <a
                                v-if="token.length !== 0"
                                class="nav-link active"
                                style="cursor: pointer"
                                data-bs-toggle="modal"
                                data-bs-target="#logOutModal"
                                ><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> 로그아웃</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <logInModal />
    <logoutModal />
    <signupModal />

    <router-view />
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import logoutModal from "./components/logoutModal.vue";
import logInModal from "./components/logInModal.vue";
import signupModal from "./components/signupModal.vue";

export default {
    name: "App",
    data() {
        return {
            inputKeyword: "",
        };
    },

    components: { logoutModal, logInModal, signupModal },
    computed: {
        ...mapState(["token"]),
    },
    methods: {
        ...mapMutations(["setToken", "setKeyword", "setCategoryName"]),
        ...mapActions(["loadProducts", "loadUser", "loadProductsCount"]),

        searchAndResult(keyword) {
            this.setCategoryName("");
            this.setKeyword(keyword);
            this.loadProducts({ keyword, page: 1 })
                .then(() => {
                    this.$router.push("/");
                })
                .catch((err) => {
                    alert(err);
                });
        },

        async keywordReset() {
            await this.setKeyword("");
        },

        async productsReset() {
            await this.loadProductsCount({ keyword: "" });
            await this.loadProducts({ keyword: "", page: 1 });
        },
    },

    beforeMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            this.setToken(token);
            this.loadUser();
        }
    },
};
</script>

<style scoped>
@import "./assets/mystyle.css";
#search-box {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
