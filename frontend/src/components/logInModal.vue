<template>
    <div class="modal fade" id="logInModal" tabindex="-1" aria-labelledby="logInModalLabel" aria-hidden="true" ref="logInModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">로그인 정보 입력</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating">
                        <textarea v-model="email" class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">이메일</label>
                    </div>
                    <div class="form-floating">
                        <textarea v-model="password" class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">비밀번호</label>
                    </div>
                </div>
                <div class="modal-footer">
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
        ...mapActions(["signIn"]),
        loginAndCheck(obj) {
            this.signIn(obj)
                .then((res) => {
                    if (res === "success") {
                        this.$refs.logInModal.setAttribute("data-bs-dismiss", "modal");
                        this.$refs.logInModal.click();
                    }
                })
                .catch((error) => {
                    alert(error.response.data);
                });
        },
    },
};
</script>

<style></style>
