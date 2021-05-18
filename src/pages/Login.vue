<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <h1>lets login</h1>
      <q-btn @click="login">Login</q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { injectMicrosoft } from 'src/auth/microsoft';

export default defineComponent({
  name: 'PageLogin',
  setup(props,{ root }) {
    const microsoft = injectMicrosoft();

    async function goHome()
    {
      if(microsoft.isLoggedIn)
      {
        await root.$router.push('/');
      }
    }

    async function login() {
      await microsoft.loginPopup();
      await goHome();
    }

    onMounted(goHome);
    return { login };
  }
});
</script>
