<template>
    <main class="flex justify-center items-center w-screen h-screen bg-dark-950 font-manrope ">
        <LoginComponent v-if="showLogin" @change-to-register="changeComponent()"/>
        <RegisterComponent v-else @change-to-login="changeComponent" />
    </main>
</template>

<script setup lang="ts">

const showLogin = ref<boolean>(true);

function changeComponent() {
    showLogin.value = !showLogin.value;
}

</script>