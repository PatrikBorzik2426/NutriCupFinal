<template>
    <div class=" 
    flex flex-col justify-center items-center p-2 h-[70%] gap-8 rounded-2xl aspect-square border-2 border-primary-500 text-white animate-fade-down
     max-sm:h-auto max-sm:w-[90%] max-sm:py-8
    ">
        <h1 class=" uppercase font-bold text-4xl max-sm:text-center max-sm:text-3xl">Register into <span>NutriCup</span></h1>
        <p class=" text-lg max-sm:text-center max-sm:px-2"> Toto je len príprava na život plný hlúpej byrokracie. </p>
        
        <form @submit.prevent="registerUser" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="login" class="text-lg">Login:</label>
                <input v-model="loginInput" type="text" id="login" name="login" class="w-64 h-10 px-2 rounded-lg bg-transparent border-2 border-primary-500 text-white" />
                <p class=" text-negative-500"> {{ loginError }} </p>
            </div>

            <div class="flex flex-col gap-2">
                <label for="password" class="text-lg">Password:</label>
                <input v-model="passwordInput" type="password" id="password" name="password" class="w-64 h-10 px-2 rounded-lg bg-transparent border-2 border-primary-500 text-white" />
                <p class=" text-negative-500"> {{ passwordError }} </p>
            </div>

            <div class=" flex flex-col gap-2 mt-4">
                <button class="w-64 h-10 bg-primary-500 rounded-lg hover:font-bold">Register</button>
                <button @click="emitChangeToLogin" type="button" class="w-64 h-10 bg-transparent rounded-lg border-2 border-primary-500 hover:bg-primary-500 hover:font-bold transition-all">Login</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { callAxios } from '~/service/callAxios';
import { defineEmits } from 'vue';

// Inputs
const loginInput = ref<string>('');
const passwordInput = ref<string>('');

// Input errors
const loginError = ref<string>('');
const passwordError = ref<string>('');

// Emits
const emit = defineEmits(['changeToLogin']);

// Methods
function emitChangeToLogin() {
    emit('changeToLogin');
}

async function registerUser(){
    
    await callAxios('unicupbackend/auth/register', 'POST', {
        login: loginInput.value,
        password: passwordInput.value
    }).then((response : any) => {
        response.data.accessToken ? localStorage.setItem('token', response.data.accessToken) : null;
        emit('changeToLogin');
    }).catch((error) => {
        console.error(error);
    });

}


</script>