<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
    <q-btn @click="login">Login</q-btn>
    <q-btn @click="graph">Graph</q-btn>
    <q-btn @click="logout">Logout</q-btn>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, ref, toRef, Ref, onMounted, getCurrentInstance,
} from '@vue/composition-api';
import { Todo, Meta } from './models';
import { AuthenticationResult } from '@azure/msal-browser'
import { Microsoft } from '../auth/microsoft'

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'CompositionComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: (Array as unknown) as PropType<Todo[]>,
      default: () => []
    },
    meta: {
      type: (Object as unknown) as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  setup(props) 
  {
    // https://docs.microsoft.com/en-us/graph/tutorials/javascript?tutorial-step=3
    const ms = Microsoft.getInstance();
    const msalObj = ms.msal;
    const currentAccounts = msalObj.getAllAccounts();
    //msalObj.setActiveAccount(currentAccounts[0]);
    if (currentAccounts === null) {
        console.log("no accounts")
        return;

    } else if (currentAccounts.length > 1) {
        // Add choose account code here
        console.log("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
    }
        console.log(currentAccounts);

    function handleResponse(resp : AuthenticationResult) {
      if (resp !== null) {
        console.log(resp)
        sessionStorage.setItem('msaluser', resp.account?.username ?? "");
        ms.msal.setActiveAccount(resp.account);
      } else {
        console.log('no bueno')
      }
    }

    function login()
    {
      msalObj.loginPopup({ scopes: ['Files.Read'] }).then(handleResponse).catch(error => {
        console.error(error);
      });
    }

    async function graph()
    {
      const user = await ms.graph
        .api('/me')
        // Only get the fields used by the app
        .select('id,displayName,mail,userPrincipalName')
        .get();
      console.log(user);
    }

    async function logout()
    {
      return ms.logOut();
    }

    return { ...useClickCount(), ...useDisplayTodo(toRef(props, 'todos')), login, graph, logout };
  },
  
});
</script>
