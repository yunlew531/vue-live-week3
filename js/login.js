const req = axios.create({
  baseURL: 'https://vue3-course-api.hexschool.io',
});
const app = Vue.createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      isValidate: false,
    };
  },
  methods: {
    async checkLogin() {
      try {
        const { data } = await req.post('/api/user/check');
        console.log(data);
        if (data.success) {
          alert(data.message);
          setTimeout(() => {
            window.location.href = '../vue-live-week3/manage.html';
          }, 3000);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async login() {
      this.isValidate = true;
      const user = {
        ...this.user
      };
      for (const props in user) {
        if (!user[props]) return;
      }
      try {
        const { data } = await req.post('/admin/signin', user);
        alert(data.message);
        if (data.success) {
          const token = data.token;
          const expired = new Date(data.expired);
          document.cookie = `Hegoze=${token}; expires=${expired}`;
          window.location.href = './manage.html';
        }
      }
      catch (err) {
        console.dir(err);
      }
    },
  },
  created() {
    this.checkLogin();
  },
}).mount('#app');
