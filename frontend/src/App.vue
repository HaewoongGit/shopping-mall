<template>
    <!-- 상단바 코드 -->

    <nav class="navbar navbar-expand-lg bg-topBar">
        <div class="container-fluid">
            <a class="navbar-brand" @click="$router.push('/')" style="cursor: pointer"
                ><img src="./assets/shopping.png" width="30" height="30" /> 아는 사람만 아는 스토어</a
            >
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
            <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul class="navbar-nav">
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
                            @click="$router.push('/user-info')"
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
    </nav>

    <logInModal />
    <logoutModal />
    <signupModal />

    <router-view />
</template>

<script>
import { mapState } from "vuex";
import logoutModal from "./components/logoutModal.vue";
import logInModal from "./components/logInModal.vue";
import signupModal from "./components/signupModal.vue";

export default {
    name: "App",
    components: { logoutModal, logInModal, signupModal },
    computed: {
        ...mapState(["token"]),
    },
};
</script>

<style>
@import "./assets/mystyle.css";
</style>
