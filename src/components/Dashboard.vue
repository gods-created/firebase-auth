<template>  
  <v-layout class="w-100 h-100 d-flex align-center justify-center">
    <v-sheet class="mx-auto" width="300">
      <h1 class="text-center">User information</h1>

      <v-form class="mt-5">
        <v-text-field
          class="mb-1"
          type="text"
          v-model="user.displayName"
          :rules="form.rules.displayName"
          label="Display name"
        ></v-text-field>

        <v-text-field
          type="email"
          v-model="user.email"
          :rules="form.rules.email"
          label="Email"
          disabled
        ></v-text-field>

        <v-btn class="mt-2" color="primary" type="submit" :loading="form.button" :disabled="form.button" block @click.prevent="updateUser">Update info</v-btn>
        <v-btn color="red" class="mt-3" type="submit" block @click.prevent="logout">Logout</v-btn>
      </v-form>
    </v-sheet>
  </v-layout class="w-100 h-100 d-flex align-center justify-center">
</template>

<script>
import logoutProcess from '@/mixins/auth.js';
import updateUserProcess from '@/mixins/auth.js';

export default {
  name: 'DashboardView',
  mixins: [
    logoutProcess,
    updateUserProcess,
  ],
  data () {
    return {
      user: null,
      form: {
        rules: {
          email: [
            v => !!v || 'Can\'t empty field!',
            v => this.isEmail(v) || 'Only email!'
          ],

          displayName: [
            v => !!v || 'Can\'t empty field!',
          ]
        },

        button: false,
      }
    }
  },

  created() {
    this.user = this.$store.getters.user || {}
  },

  methods: {
    checkout() {
      return this.$emit('checkout', true);
    },

    logout() {
      this.logoutProcess();
      return this.$emit('checkout');
    },

    async updateUser() {
      const form = this.form;
      const user = this.user;

      if (!this.validateProcess(user.email, [ { 'displayName': user.displayName } ])) {
        return;
      }

      try {
        form.button = true;

        const request = await this.updateUserProcess(user);
        const { status, err_description } = request;
        if (status === 'success') {
          this.checkout();
        } else {
          alert(err_description);
        }
      } catch (e) {
        alert(e.message);
      } 

      form.button = false;
      return;
    }
  }
}

</script>