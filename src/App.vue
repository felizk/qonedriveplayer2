<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent, provide } from '@vue/composition-api';
import { Microsoft, MicrosoftKey } from './auth/microsoft';

const microsoft = new Microsoft();

export default defineComponent({
  name: 'App',
  setup() {
    provide(MicrosoftKey, microsoft);
  },
  
  // This is the navigation guard that puts you back to the login screen if not logged in.
  beforeRouteEnter(to, from, next)
  {
    if (to.name !== 'Login' && !microsoft.isLoggedIn) {
      next({ name: 'Login' });
    } else {
      next()
    }
  }
});
</script>
