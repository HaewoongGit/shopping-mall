<template>
    <div>
        <h5>내 정보 변경</h5>
        <hr />
        <form>
            <div class="form-group d-flex mb-3">
                <label for="email" class="mr-3" style="width: 25%">이메일</label>
                <input
                    type="email"
                    class="form-control"
                    id="email"
                    :placeholder="user.email"
                    style="width: 75%"
                    disabled
                />
            </div>

            <div class="form-group d-flex mb-3">
                <label for="password" class="mr-3" style="width: 25%">비밀번호</label>
                <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="비밀번호 변경시 입력해주세요."
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
                <label for="phoneNumber" class="mr-3" style="width: 25%">휴대폰 번호</label>
                <input
                    v-model="phoneNumber"
                    type="tel"
                    class="form-control"
                    id="phoneNumber"
                    :placeholder="user.phoneNumber"
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
                    :placeholder="user.userName"
                    style="width: 75%"
                />
            </div>

            <div class="form-group d-flex mb-3">
                <label for="age" class="mr-3" style="width: 25%">나이</label>
                <select v-model.number="age" class="form-control" id="age" style="width: 75%">
                    <option value="">선택하세요</option>
                    <option v-for="n in 150" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
        </form>
    </div>
    <div class="footer d-flex justify-content-center">
        <button @click="infoUpdate()" type="button" class="btn btn-primary">정보 변경</button>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            userName: "",
            age: "",
        };
    },
    computed: {
        ...mapState(["user"]),
    },
    methods: {
        ...mapActions(["loadUser", "userInfoChange"]),

        infoUpdate() {
            if (this.password !== this.confirmPassword) {
                alert("비밀번호가 다릅니다.");
                return;
            }

            const age = this.age === "" ? null : this.age;

            this.userInfoChange({
                password: this.password,
                phoneNumber: this.phoneNumber,
                userName: this.userName,
                age,
            })
                .then(() => alert("변경 완료"))
                .catch((err) => {
                    alert(err);
                });
        },
    },

    async beforeMount() {
        await this.loadUser();
        this.phoneNumber = this.user.phoneNumber;
        this.userName = this.user.userName;
        this.age = this.user.age;
    },
};
</script>

<style></style>
