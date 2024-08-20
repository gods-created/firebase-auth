<template>  
  <v-layout class="w-100 h-100 d-flex align-center justify-center">
    <v-sheet class="mx-auto" width="300">
      <v-form>
        <v-text-field
          class="mb-1"
          type="email"
          v-model="form.email"
          :rules="form.rules.email"
          label="Email"
        ></v-text-field>

        <div class="d-flex align-center justify-center">
          <v-text-field
            :type="form.passwordFieldType"
            v-model="form.password"
            :rules="form.rules.password"
            label="Password"
          ></v-text-field>

          <v-btn color="red" class="mb-5 mx-2" @mouseover="showPassword" @mouseleave="showPassword(false)">
            <v-icon
              icon="mdi-eye"
              center
            ></v-icon>
          </v-btn>
        </div>

        <v-btn class="mt-2" color="primary" type="submit" :loading="form.buttons.signIn.loading" :disabled="form.buttons.disabled" block @click.prevent="signIn">Sign In</v-btn>
        <v-btn class="mt-2" color="secondary" type="submit" :loading="form.buttons.signUp.loading" :disabled="form.buttons.disabled" block @click.prevent="signUp">Sign Up</v-btn>
      </v-form>
    </v-sheet>
  </v-layout>
</template>

<script>
import createUserProcess from '@/mixins/auth.js';
import signInUserProcess from '@/mixins/auth.js';

export default {
  name: 'AuthView',
  mixins: [
    createUserProcess,
    signInUserProcess,
  ],
  data () {
    return {
      form: {
        email: '',
        password: '',
        rules: {
          email: [
            v => !!v || 'Can\'t empty field!',
            v => this.isEmail(v) || 'Only email!'
          ],

          password: [
            v => !!v || 'Can\'t empty field!',
            v => v.replaceAll(' ', '').length >= 8 || 'More than 7 characters!'
          ]
        },

        passwordFieldType: 'password',
        buttons: {
          signIn: {
            loading: false
          },

          signUp: {
            loading: false
          },

          disabled: false
        }
      }
    }
  },

  methods: {
    checkout() {
      return this.$emit('checkout', true);
    },

    showPassword(p=true) {
      if (p) {
        this.form.passwordFieldType = 'text';
      } else if (!p) {
        this.form.passwordFieldType = 'password';
      }
    },

    async signIn() {
      const form = this.form;
      const buttons = form.buttons;
      const email = form.email;
      const password = form.password;

      if (!this.validateProcess(email, [ { 'password': password } ])) {
        return;
      }

      try {
        buttons.signIn.loading = true;
        buttons.disabled = true;

        const request = await this.signInUserProcess(email, password);
        const { status, err_description, user } = request;
        if (status === 'success') {
          this.checkout();
        } else {
          alert(err_description);
        }
      } catch (e) {
        alert(e.message);
      } 

      buttons.signIn.loading = false;
      buttons.disabled = false;
      return;
    },

    async signUp() {
      const form = this.form;
      const buttons = form.buttons;
      const email = form.email;
      const password = form.password;

      if (!this.validateProcess(email, [ { 'password': password } ])) {
        return;
      }

      try {
        buttons.signUp.loading = true;
        buttons.disabled = true;

        const request = await this.createUserProcess(email, password);
        const { status, err_description, user } = request;
        if (status === 'success') {
          this.checkout();
        } else {
          alert(err_description);
        }
      } catch (e) {
        alert(e.message);
      } 

      buttons.signUp.loading = false;
      buttons.disabled = false;
      return;
    },
  }
}

</script>