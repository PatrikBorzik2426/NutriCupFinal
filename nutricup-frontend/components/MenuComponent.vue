<template>
  <div class="w-full flex justify-center items-center gap-2 mb-4">
      <button @click="dayBefore" class="w-8 h-8 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all"><</button>
      <div id="datapicker" class="flex justify-between w-[75%] p-1 h-12 bg-dark-950 border-2 border-primary-500 rounded-md">
          <!-- Day Selector -->
          <select @change="manualDateChange" v-model="selectedDay" class="px-4 py-2  border rounded-md bg-dark-950 text-primary-500 border-none appearance-none focus:ring-primary-500 focus:border-primary-500">
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
          
          <!-- Month Selector -->
          <select @change="manualDateChange" v-model="selectedMonth" class="px-4 py-2  border rounded-md bg-dark-950 text-primary-500 border-none appearance-none focus:ring-primary-500 focus:border-primary-500">
              <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
          </select>
          
          <!-- Year Selector -->
          <select @change="manualDateChange" v-model="selectedYear" class="px-4 py-2  border rounded-md bg-dark-950 text-primary-500 border-none appearance-none focus:ring-primary-500 focus:border-primary-500">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
      </div>
      <button @click="nextDay" class="w-8 h-8 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all">></button>
  </div>

  <div class="grid grid-cols-2 text-center w-fit mx-auto gap-4 mb-6">
      <button class="w-32 h-10 mx-auto rounded-lg border-2 border-primary-500 hover:font-bold transition-all uppercase font-regular"
          :class="{
              'bg-primary-500': activeDailyStats,
              'bg-transparent': !activeDailyStats
          }"
          @click="activeDailyStats = !activeDailyStats"
      >Denný</button>

      <button class="w-32 h-10 mx-auto rounded-lg border-2 border-primary-500 hover:font-bold transition-all uppercase font-regular"
          :class="{
              'bg-primary-500': !activeDailyStats,
              'bg-transparent': activeDailyStats
          }"
          @click="activeDailyStats = !activeDailyStats"
      >
      Mesačný</button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted, watch } from 'vue';

// Emits
const emit = defineEmits(['currentDate']);

const activeDailyStats = ref<boolean>(true);

// State for selected day, month, and year
const selectedDay = ref(1);
const selectedMonth = ref(1);
const selectedYear = ref(new Date().getFullYear());

// Generate days, months, and years
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
'January', 'February', 'March', 'April', 'May', 
'June', 'July', 'August', 'September', 'October', 
'November', 'December'
];
const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

// Fix: Use ISO 8601 format (YYYY-MM-DD) to avoid issues with Safari/iPhone
function formatDate(year: number, month: number, day: number): string {
const paddedMonth = String(month).padStart(2, '0');
const paddedDay = String(day).padStart(2, '0');
return `${year}-${paddedMonth}-${paddedDay}`;
}

function setDateToday() {
const today = new Date();
selectedDay.value = today.getDate();
selectedMonth.value = today.getMonth() + 1; // Months are zero-indexed
selectedYear.value = today.getFullYear();
emit('currentDate', formatDate(selectedYear.value, selectedMonth.value, selectedDay.value));
}

function dayBefore() {
const currentDate = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value); // Create date object
currentDate.setDate(currentDate.getDate() - 1); // Go back one day
selectedDay.value = currentDate.getDate();
selectedMonth.value = currentDate.getMonth() + 1; // Months are zero-indexed
selectedYear.value = currentDate.getFullYear();
emit('currentDate', formatDate(selectedYear.value, selectedMonth.value, selectedDay.value));
}

function nextDay() {
const currentDate = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value); // Create date object
currentDate.setDate(currentDate.getDate() + 1); // Go forward one day
selectedDay.value = currentDate.getDate();
selectedMonth.value = currentDate.getMonth() + 1; // Months are zero-indexed
selectedYear.value = currentDate.getFullYear();
emit('currentDate', formatDate(selectedYear.value, selectedMonth.value, selectedDay.value));
}

function manualDateChange() {
// Emit formatted date whenever manual changes occur
emit('currentDate', formatDate(selectedYear.value, selectedMonth.value, selectedDay.value));
}

onMounted(() => {
setDateToday();
});

watch([selectedMonth, selectedYear], () => {
const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate();
if (selectedDay.value > daysInMonth) {
  selectedDay.value = daysInMonth;
}
});
</script>
