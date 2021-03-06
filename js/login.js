const req = axios.create({
  baseURL: 'https://vue3-course-api.hexschool.io',
  headers: { common: {} },
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
        if (data.success) {
          alert('已登入!跳轉中');
          setTimeout(() => {
            window.location.href = './manage.html';
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
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    req.defaults.headers.common['Authorization'] = token;
    this.checkLogin();
  },
}).mount('#app');
