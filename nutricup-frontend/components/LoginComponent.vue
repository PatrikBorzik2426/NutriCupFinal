<template>
    <div class=" 
    flex flex-col justify-center items-center p-2 h-[70%] gap-8 rounded-2xl aspect-square border-2 border-primary-500 text-white animate-fade-down
     max-sm:h-auto max-sm:w-[90%] max-sm:py-8
    ">
        <h1 class=" uppercase font-bold text-4xl max-sm:text-center">Login into <span>NutriCup</span></h1>
        <p class=" text-lg max-sm:text-center max-sm:px-2"> Pekne sa prihlás cica, aby si bola obrovská <span class="text-primary-500 animate-pulse animate-infinite">Valkýra</span>. </p>
        
        <form @submit.prevent="loginUser()"
         class="flex flex-col gap-4">
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
                <button type="submit" class="w-64 h-10 bg-primary-500 rounded-lg hover:font-bold">Login</button>
                <button @click="emitChangeToRegister" 
                    type="button" 
                    class="w-64 h-10 bg-transparent rounded-lg border-2 border-primary-500 hover:bg-primary-500 hover:font-bold transition-all">Register</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { callAxios } from '~/service/callAxios';
import { defineEmits } from 'vue';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// Inputs
const loginInput = ref<string>('');
const passwordInput = ref<string>('');

// Input errors
const loginError = ref<string>('');
const passwordError = ref<string>('');

// Emits
const emit = defineEmits(['changeToRegister']);

// Methods
function emitChangeToRegister() {
    emit('changeToRegister');
}

async function loginUser(){
    if (loginInput.value === '' || loginInput.value === null) {
        loginError.value = 'Login is required';
        return;
    } else {
        loginError.value = '';
    }

    if (passwordInput.value === '' || passwordInput.value === null) {
        passwordError.value = 'Password is required';
        return;
    } else {
        passwordError.value = '';
    }
    
    await callAxios('unicupbackend/auth/login', 'POST', {
        login: loginInput.value,
        password: passwordInput.value
    }).then((response : any) => {
        response.data.accessToken ? localStorage.setItem('token', response.data.accessToken) : null;
        console.log(localStorage.getItem('token'));
        router.push('/dashboard');
    }).catch((error) => {
        console.error(error);
    });
}


</script>