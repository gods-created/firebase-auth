<template>  
  <header>
    <v-app-bar :elevation="2">
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>
  </header>

  <KeepAlive>
    <component :is="currentComponent" @checkout="checkout" />
  </KeepAlive>
</template>

<script>
import AuthView from '@/components/Auth.vue';
import DashboardView from '@/components/Dashboard.vue';
import ifUserAuth from '@/mixins/auth';
import validateProcess  from '@/mixins/auth.js'
import isEmail from '@/mixins/auth.js';

export default {
  name: 'BaseView',
  mixins: [
    ifUserAuth,
    validateProcess,
    isEmail
  ],
  components: {
    AuthView,
    DashboardView
  },
  data () {
    return {
      currentComponent: 'AuthView'
    }
  },

  created() {
    this.ifUserAuthProcess();
  },

  methods: {
    ifUserAuthProcess() {
      const user = this.ifUserAuth();
      if (user !== null) {
        this.$store.commit('updateUserState', user);
        this.currentComponent = 'DashboardView';
      } else {
        this.currentComponent = 'AuthView';
      }

      return;
    },

    checkout() {
      return this.ifUserAuthProcess();
    },
  }
}

</script>