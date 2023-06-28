<template>
    <div class="d-flex justify-content-center vh-100 mt-5">
        <div class="container" style="width: 70%">
            <div class="row">
                <div class="col-3">
                    <div class="list-group">
                        <router-link to="/user-info" class="list-group-item list-group-item-action" exact
                            >내 정보변경</router-link
                        >
                        <router-link to="/registered-products" class="list-group-item list-group-item-action" exact
                            >등록한 상품</router-link
                        >
                        <router-link to="/registered-reviews" class="list-group-item list-group-item-action" exact
                            >등록한 리뷰</router-link
                        >
                    </div>
                </div>
                <div class="col-9">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.router-link-active {
    background-color: #007bff;
    color: white;
}
</style>
