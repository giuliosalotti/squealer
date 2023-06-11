<template>
    <div class="channelbox">
        <div class="d-flex" style="margin-bottom:60px;">
            <h2 class="me-5 titolo">Channels</h2>
            <button type="button" class="btn btn-success btn-sm">Add channel</button>
        </div>
        <div class="canale d-flex">
            <img  class="me-2 avatar" src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80">
            <p>Il meglio del cinema italiano.</p>
        </div>
        <div class="canale d-flex">
            <img  class="me-2 avatar" src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80">
            <p>Il meglio del cinema italiano.</p>
        </div>
        <div class="canale d-flex">
            <img  class="me-2 avatar" src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80">
            <p>Il meglio del cinema italiano.</p>
        </div>
    </div>
</template>

<style scoped>
    .titolo{
        margin-bottom: 0px !important;
    }
    .channelbox{
        padding: 50px 30px;
    }
    .avatar{
        width: 30px;
        height: 30px;
        border-radius: 30px;
        object-fit: cover;
    }
    .canale{
        margin: 20px 0px;
    }
</style>