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
}).mount('#app');
