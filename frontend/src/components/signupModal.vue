<template>
    <div
        class="modal fade"
        id="signupModal"
        tabindex="-1"
        aria-labelledby="signupModalLabel"
        aria-hidden="true"
        ref="signupModal"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">회원가입</h5>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group d-flex mb-3">
                            <label for="email" class="mr-3" style="width: 25%">이메일</label>
                            <input
                                v-model="email"
                                type="email"
                                class="form-control"
                                id="email"
                                placeholder="email@email.com"
                                style="width: 75%"
                            />
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

                        <div class="form-group d-flex mb-3">
                            <label for="userName" class="mr-3" style="width: 25%">이름</label>
                            <input
                                v-model="userName"
                                type="name"
                                class="form-control"
                                id="userName"
                                placeholder="이름을 입력하세요."
                                style="width: 75%"
                            />
                        </div>

                        <div class="form-group d-flex mb-3">
                            <label for="phoneNumber" class="mr-3" style="width: 25%">휴대폰 번호</label>
                            <input
                                v-model="phoneNumber"
                                type="tel"
                                class="form-control"
                                id="phoneNumber"
                                placeholder="010-xxxx-xxxx"
                                style="width: 75%"
                            />
                        </div>

                        <div class="form-group d-flex mb-3">
                            <label for="age" class="mr-3" style="width: 25%">나이</label>
                            <input
                                v-model="age"
                                @input="validateAge"
                                type="text"
                                class="form-control"
                                id="age"
                                placeholder="나이를 입력하세요."
                                style="width: 75%"
                            />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    <button
                        @click="signUpAndClose({ email, age, phoneNumber, userName, password, confirmPassword })"
                        type="button"
                        class="btn btn-primary"
                    >
                        회원가입
                    </button>
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
            confirmPassword: "",
            phoneNumber: "",
            userName: "",
            age: "",
        };
    },
    methods: {
        ...mapActions(["signUp"]),
        signUpAndClose(obj) {
            if (obj.password !== obj.confirmPassword) {
                alert("비밀번호가 다릅니다.");
                return;
            }
            this.signUp(obj)
                .then((res) => {
                    if (res === "success") {
                        alert("회원가입되었습니다. 로그인해주세요!");
                        this.$refs.signupModal.setAttribute("data-bs-dismiss", "modal");
                        this.$refs.signupModal.click();
                    }
                })
                .catch((error) => {
                    alert(error.message);
                });
        },
        validateAge() {
            const parsedAge = parseInt(this.age);
            if (isNaN(parsedAge)) {
                this.age = "";
                alert("숫자를 입력해주세요!");
            }

            if (parsedAge < 1) {
                this.age = "";
                alert("0보다 큰 숫자를 입력하세요.");
            }
        },
    },
};
</script>

<style></style>
