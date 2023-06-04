<template>
    <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="cartModalLabel">알림</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>장바구니에 담았습니다. 장바구니로 갈까요?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    <button @click="$router.push('/cart')" type="button" class="btn btn-primary" data-bs-dismiss="modal">장바구니</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        quantity: Number,
    },
};
</script>

<style></style>
