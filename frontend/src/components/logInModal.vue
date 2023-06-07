<template>
    <div class="modal fade" id="logInModal" tabindex="-1" aria-labelledby="logInModalLabel" aria-hidden="true" ref="logInModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">로그인 정보 입력</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating mb-1">
                        <textarea v-model="email" class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">이메일</label>
                    </div>
                    <div class="form-floating">
                        <input v-model="password" type="password" class="form-control" id="login-password" placeholder="영문과 숫자로 6자리 이상" />
                        <label for="floatingTextarea">비밀번호</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="http://localhost:3000/login/google">
                        <img
                            src="../assets/Google_Logo.svg.png"
                            alt="Google Logo"
                            width="55"
                            height="40"
                            style="cursor: pointer; border: 1px solid #ccc; padding: 5px"
                        />
                    </a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#signupModal">
                        회원가입
                    </button>
                    <button @click="loginAndCheck({ email, password })" type="button" class="btn btn-primary">로그인</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },

    methods: {
        ...mapActions(["signIn", "restoreToken"]),
        loginAndCheck(obj) {
            this.signIn(obj)
                .then((res) => {
                    if (res === "success") {
                        this.$refs.logInModal.setAttribute("data-bs-dismiss", "modal"); // "$refs" -> vue에서 제공하는 요소 접근 기능
                        this.$refs.logInModal.click();

                        this.restoreToken()
                            .then((res) => {
                                if (res === "success") console.log("토큰이 재발행됨.");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        },
    },
};
</script>

<style></style>
