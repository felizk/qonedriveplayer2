<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <p>{{ user.displayName }}</p>
      <p>{{ user.mail }}</p>
      <p>{{ user.id }}</p>
      <q-btn @click="accessGraph">Click here to access Microsoft Graph</q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { injectMicrosoft } from 'src/auth/microsoft';

interface UserResult
{
  displayName: string;
  id?: string;
  mail?: string;
}

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup() {
    const user = ref<UserResult>({displayName: 'nothing yet'});
    const microsoft = injectMicrosoft();
    
    async function accessGraph() {
      user.value = (await microsoft
        .graph.api('/me')
        .select('id,displayName,mail,userPrincipalName')
        .get()) as UserResult;
    }

    return { user, accessGraph };
  }
});
</script>
