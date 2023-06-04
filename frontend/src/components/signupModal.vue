<template>
    <div class="modal fade" id="signupModal" tabindex="-1" aria-labelledby="signupModalLabel" aria-hidden="true" ref="signupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">회원가입</h5>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group d-flex mb-3">
                            <label for="nickname" class="mr-3" style="width: 25%">닉네임</label>
                            <input v-model="nickname" type="text" class="form-control" id="nickname" placeholder="닉네임" style="width: 75%" />
                        </div>
                        <div class="form-group d-flex mb-3">
                            <label for="email" class="mr-3" style="width: 25%">이메일</label>
                            <input v-model="email" type="email" class="form-control" id="email" placeholder="email@email.com" style="width: 75%" />
                        </div>
                        <div class="form-group d-flex mb-3">
                            <label for="password" class="mr-3" style="width: 25%">비밀번호</label>
                            <input
                                v-model="password"
                                type="password"
                                class="form-control"
                                id="password"
                                placeholder="영문과 숫자로 6자리 이상"
                                style="width: 75%"
                            />
                        </div>
                        <div class="form-group d-flex mb-3">
                            <label for="password2" class="mr-3" style="width: 25%">비밀번호 확인</label>
                            <input
                                v-model="confirmPassword"
                                type="password"
                                class="form-control"
                                id="password2"
                                placeholder="비밀번호 재입력"
                                style="width: 75%"
                            />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    <button @click="signUpAndClose({ email, nickname, password, confirmPassword })" type="button" class="btn btn-primary">회원가입</button>
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
            nickname: "",
            password: "",
            confirmPassword: "",
        };
    },
    methods: {
        ...mapActions(["signUp"]),
        signUpAndClose(obj) {
            this.signUp(obj)
                .then((res) => {
                    if (res === "success") {
                        alert("회원가입되었습니다. 로그인해주세요!");
                        this.$refs.signupModal.setAttribute("data-bs-dismiss", "modal");
                        this.$refs.signupModal.click();
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
