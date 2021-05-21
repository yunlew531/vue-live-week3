const req = axios.create({
  baseURL: 'https://vue3-course-api.hexschool.io',
  headers: { common: {} },
});
const api_path = 'yunlew';
const app = Vue.createApp({
  data() {
    return {
      productsData: [],
      productModal: null,
      delProductModal: null,
      messageModal: null,
      messageText: '',
      tempId: '',
      tempProduct: {},
      IsTempProductValidate: false,
      modalAction: '',
    };
  },
  methods: {
    async checkLogin() {
      try {
        const { data } = await req.post('/api/user/check');
        if (data.success) {
          this.getProducts();
        } else {
          this.messageModal.show();
          this.messageText = data.message;
          setTimeout(() => {
            window.location.href = '../vue-live-week3/index.html';
          }, 3000);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async getProducts() {
      try {
        const { data } = await req.get(`/api/${api_path}/admin/products/all`);
        this.productsData = data.products;
      }
      catch(err) {
        console.dir(err);
      }
    },
    openProductModal(action, product) {
      this.modalAction = action === 'new' ? '新增產品' : '編輯產品';
      this.tempProduct = action === 'edit' ? { ...product } : {};
      this.tempId = product?.id;
      this.productModal.show();
    },
    openDelProductModal(id) {
      this.tempId = id;
      this.delProductModal.show();
    },
    async deleteProduct() {
      try {
        const { data } = await req.delete(`/api/${api_path}/admin/product/${this.tempId}`);
        this.messageModal.show();
        this.messageText = data.message;
        this.delProductModal.hide();
        if (data.success) {
          this.delProductModal.hide();
          this.getProducts();
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    closeProductModal() {
      this.productModal.hide();
      this.resetModal();
    },
    resetModal() {
      this.tempProduct = {};
      this.IsTempProductValidate = false;
      this.tempId = '';
    },
    async reqProduct() {
      const api = this.modalAction === '新增產品' ? 
      `/api/${api_path}/admin/product` :
      `/api/${api_path}/admin/product/${this.tempId}`;
      const Method = this.modalAction === '新增產品' ? 'post' : 'put';
      this.IsTempProductValidate = true;
      const { title, category, unit, origin_price, price } = this.tempProduct;
      if (!title || !category || !unit || !origin_price || !price) return;
      try {
        const { data } = await req[Method](api, { data: this.tempProduct });
        this.messageModal.show();
        this.messageText = data.message;
        if (data.success) {
          this.productModal.hide();
          this.resetModal();
        }
      }
      catch(err) {
        console.dir(err);
      }
      this.getProducts();
    },
    async logout() {
      try {
        const { data } = await req.post('/logout');
        this.messageModal.show();
        this.messageText = data.message;
        if (data.success) {
          document.cookie = `Hegoze=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
          setTimeout(() => {
            window.location.href = '../vue-live-week3/index.html';
          }, 3000);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async uploadImg() {
      const file = this.$refs.imgUpload.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', file);
      try {
        const { data } = await req.post(`/api/${api_path}/admin/upload`, formData);
        this.messageModal.show();
        if (data.success) {
          this.messageText = '上傳成功!';
          this.tempProduct.imageUrl = data.imageUrl;
        } else {
          this.messageText = data.message;
        }
      }
      catch(err) {
        console.dir(err);
      }
    }
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    req.defaults.headers.common['Authorization'] = token;
    this.checkLogin();
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.productModal, { keyboard: false });
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal, { keyboard: false });
    this.messageModal = new bootstrap.Modal(this.$refs.messageModal, { keyboard: false });
  },
}).mount('#app');
