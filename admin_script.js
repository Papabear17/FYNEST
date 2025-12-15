// ADMIN DASHBOARD LOGIC + SIMPLE LOGIN
const STORAGE_KEY = "fynest_products_v1";
const ADMIN_AUTH_KEY = "wili_admin_auth_v1";
const ADMIN_USERNAME = "wili";
const ADMIN_PASSWORD = "wiliam";
const STORAGE_KEY_3D_MODEL = "wili_3d_model_v1";

// --- HELPERS (Copied/Restored for Admin Independence) ---
function formatIDR(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);
}

function getStoredProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setStoredProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function ensureSeedProducts() {
  const current = getStoredProducts();
  if (!current || current.length === 0) {
    const seeds = [
      { id: '1', name: "OVERSIZED TEE - BLACK", category: "T-SHIRTS", price: 249000, stock: 15, isNew: true, featured: false },
      { id: '2', name: "BOMBER JACKET - OLIVE", category: "OUTERWEAR", price: 599000, stock: 3, isNew: false, featured: true }
    ];
    setStoredProducts(seeds);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Pastikan data sample minimal ada
  ensureSeedProducts && ensureSeedProducts();

  const form = document.getElementById("productForm");
  const formTitle = document.getElementById("formTitle");
  const tableBody = document.getElementById("productTableBody");
  const searchInput = document.getElementById("searchInput");
  const btnSeed = document.getElementById("btnSeed");
  const btnReset = document.getElementById("btnReset");
  const coverFileInput = document.getElementById("fieldCoverFile");
  const galleryFilesInput = document.getElementById("fieldGalleryFiles");
  const field3DModelImage = document.getElementById("field3DModelImage");
  const field3DModelFile = document.getElementById("field3DModelFile");
  const btnRemove3D = document.getElementById("btnRemove3D");
  const loginOverlay = document.getElementById("loginOverlay");
  const loginForm = document.getElementById("loginForm");
  const btnLogout = document.getElementById("btnLogout");

  // ==== AUTH HELPERS ====
  function isAuthenticated() {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
    } catch {
      return false;
    }
  }

  function setAuthenticated(value) {
    try {
      if (value) {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }
    } catch {
      // ignore
    }
  }

  function updateAuthUI() {
    const authed = isAuthenticated();
    if (authed) {
      loginOverlay.classList.add("hidden");
    } else {
      loginOverlay.classList.remove("hidden");
    }
  }

  // Inisialisasi UI auth
  updateAuthUI();

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      updateAuthUI();
    } else {
      alert("Username atau password salah. Gunakan kredensial demo yang tertera.");
    }
  });

  btnLogout?.addEventListener("click", () => {
    const ok = confirm("Logout dari Admin Atelier?");
    if (!ok) return;
    setAuthenticated(false);
    updateAuthUI();
  });

  function loadProducts() {
    return getStoredProducts ? getStoredProducts() : [];
  }

  function saveProducts(list) {
    if (setStoredProducts) setStoredProducts(list);
  }

  function renderTable(filter = "") {
    if (!isAuthenticated()) {
      // Jangan render data kalau belum login
      return;
    }
    const products = loadProducts();
    const query = filter.trim().toLowerCase();
    tableBody.innerHTML = "";

    const filtered = !query
      ? products
      : products.filter((p) => {
        const haystack =
          (p.name || "") +
          " " +
          (p.category || "") +
          " " +
          (p.colorStory || "") +
          " " +
          (p.season || "");
        return haystack.toLowerCase().includes(query);
      });

    if (!filtered.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.style.color = "#a0a0ad";
      td.textContent =
        "Belum ada look yang cocok dengan filter. Tambah look baru atau reset data sample.";
      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }

    filtered.forEach((p) => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = p.name || "Untitled Look";

      const tdCat = document.createElement("td");
      tdCat.textContent = p.category || "—";

      const tdPrice = document.createElement("td");
      tdPrice.textContent = formatIDR ? formatIDR(p.price) : p.price;

      const tdSeason = document.createElement("td");
      tdSeason.textContent = p.season || "—";

      const tdFeatured = document.createElement("td");
      if (p.featured) {
        const span = document.createElement("span");
        span.className = "pill-mini";
        span.textContent = "FEATURED";
        tdFeatured.appendChild(span);
      } else {
        tdFeatured.textContent = "-";
      }

      const tdActions = document.createElement("td");
      const wrap = document.createElement("div");
      wrap.className = "table-actions";

      const btnEdit = document.createElement("button");
      btnEdit.type = "button";
      btnEdit.className = "btn-icon";
      btnEdit.textContent = "Edit";
      btnEdit.addEventListener("click", () => {
        populateForm(p);
      });

      const btnDelete = document.createElement("button");
      btnDelete.type = "button";
      btnDelete.className = "btn-icon danger";
      btnDelete.textContent = "Del";
      btnDelete.addEventListener("click", () => {
        const ok = confirm(
          `Hapus look "${p.name || "Untitled"}"? Tindakan ini tidak bisa di-undo.`
        );
        if (!ok) return;
        const list = loadProducts().filter((x) => x.id !== p.id);
        saveProducts(list);
        renderTable(searchInput.value || "");
      });

      wrap.appendChild(btnEdit);
      wrap.appendChild(btnDelete);
      tdActions.appendChild(wrap);

      tr.appendChild(tdName);
      tr.appendChild(tdCat);
      tr.appendChild(tdPrice);
      tr.appendChild(tdSeason);
      tr.appendChild(tdFeatured);
      tr.appendChild(tdActions);

      tableBody.appendChild(tr);
    });
  }

  function generateId(name) {
    const slug = (name || "look")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug + "-" + Math.random().toString(36).slice(2, 6);
  }

  function parseList(value) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function populateForm(p) {
    formTitle.textContent = "Edit Look";
    document.getElementById("fieldId").value = p.id || "";
    document.getElementById("fieldName").value = p.name || "";
    document.getElementById("fieldCategory").value = p.category || "";
    document.getElementById("fieldPrice").value = p.price ?? "";
    document.getElementById("fieldColorStory").value = p.colorStory || "";
    document.getElementById("fieldSeason").value = p.season || "";
    document.getElementById("fieldCoverImage").value = p.coverImage || "";
    document.getElementById("fieldGallery").value = (p.gallery || []).join(", ");
    document.getElementById("fieldShortDescription").value =
      p.shortDescription || "";
    document.getElementById("fieldDescription").value = p.description || "";
    document.getElementById("fieldTags").value = (p.tags || []).join(", ");
    document.getElementById("fieldFeatured").checked = !!p.featured;
  }

  function resetForm() {
    form.reset();
    document.getElementById("fieldId").value = "";
    formTitle.textContent = "Create Look";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const idField = document.getElementById("fieldId");
    const name = document.getElementById("fieldName").value.trim();
    const category = document.getElementById("fieldCategory").value.trim();
    const price = parseInt(document.getElementById("fieldPrice").value, 10) || 0;
    const colorStory = document.getElementById("fieldColorStory").value.trim();
    const season = document.getElementById("fieldSeason").value.trim();
    const coverImage = document
      .getElementById("fieldCoverImage")
      .value.trim();
    const gallery = parseList(
      document.getElementById("fieldGallery").value || ""
    );
    const shortDescription = document
      .getElementById("fieldShortDescription")
      .value.trim();
    const description = document
      .getElementById("fieldDescription")
      .value.trim();
    const tags = parseList(document.getElementById("fieldTags").value || "");
    const featured = document.getElementById("fieldFeatured").checked;

    if (!name) {
      alert("Nama look wajib diisi.");
      return;
    }

    const products = loadProducts();

    if (idField.value) {
      // Update
      const idx = products.findIndex((p) => p.id === idField.value);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          name,
          category,
          price,
          colorStory,
          season,
          coverImage,
          gallery,
          shortDescription,
          description,
          tags,
          featured
        };
      }
    } else {
      // Create
      const id = generateId(name);
      products.push({
        id,
        name,
        category,
        price,
        colorStory,
        season,
        coverImage,
        gallery,
        shortDescription,
        description,
        tags,
        featured
      });
    }

    saveProducts(products);
    renderTable(searchInput.value || "");
    resetForm();
  });

  btnReset.addEventListener("click", () => {
    resetForm();
  });

  // Upload cover image lewat File Explorer → isi fieldCoverImage dengan base64
  coverFileInput?.addEventListener("change", (event) => {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result) return;
      const coverField = document.getElementById("fieldCoverImage");
      coverField.value = typeof result === "string" ? result : "";
    };
    reader.readAsDataURL(file);
  });

  // Upload multiple gallery images → append ke fieldGallery sebagai daftar URL base64
  galleryFilesInput?.addEventListener("change", (event) => {
    const input = event.target;
    const files = Array.from(input.files || []);
    if (!files.length) return;

    const urls = [];
    let remaining = files.length;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          urls.push(reader.result);
        }
        remaining -= 1;
        if (remaining === 0) {
          const galleryField = document.getElementById("fieldGallery");
          const existing = galleryField.value.trim();
          const joined = urls.join(", ");
          galleryField.value = existing ? `${existing}, ${joined}` : joined;
        }
      };
      reader.readAsDataURL(file);
    });
  });

  btnSeed.addEventListener("click", () => {
    const ok = confirm(
      "Reset ke sample data akan menghapus semua perubahan manual. Lanjutkan?"
    );
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    ensureSeedProducts && ensureSeedProducts();
    renderTable(searchInput.value || "");
  });

  searchInput.addEventListener("input", () => {
    renderTable(searchInput.value || "");
  });

  // ==== 3D MODEL IMAGE MANAGEMENT ====
  function get3DModelImage() {
    try {
      return localStorage.getItem(STORAGE_KEY_3D_MODEL) || "";
    } catch {
      return "";
    }
  }

  function set3DModelImage(url) {
    try {
      if (url && url.trim()) {
        localStorage.setItem(STORAGE_KEY_3D_MODEL, url.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_3D_MODEL);
      }
    } catch {
      // ignore
    }
  }

  // Load foto 3D yang tersimpan saat halaman dibuka
  const saved3DImage = get3DModelImage();
  if (field3DModelImage && saved3DImage) {
    field3DModelImage.value = saved3DImage;
  }

  // Upload foto 3D model lewat File Explorer
  field3DModelFile?.addEventListener("change", (event) => {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result || typeof result !== "string") return;
      if (field3DModelImage) {
        field3DModelImage.value = result;
      }
      set3DModelImage(result);
      alert("Foto 3D model berhasil di-upload! Refresh halaman utama untuk melihat perubahan.");
    };
    reader.readAsDataURL(file);
  });

  // Simpan URL 3D model saat user mengetik manual
  field3DModelImage?.addEventListener("blur", () => {
    const url = field3DModelImage.value.trim();
    set3DModelImage(url);
    if (url) {
      alert("URL foto 3D model tersimpan! Refresh halaman utama untuk melihat perubahan.");
    }
  });

  // Tombol hapus foto 3D (kembali ke 3D default)
  btnRemove3D?.addEventListener("click", () => {
    const ok = confirm("Hapus foto 3D model dan kembali ke manekin 3D default?");
    if (!ok) return;
    set3DModelImage("");
    if (field3DModelImage) field3DModelImage.value = "";
    if (field3DModelFile) field3DModelFile.value = "";
    alert("Foto 3D model dihapus. Refresh halaman utama untuk melihat manekin 3D default.");
  });

  // Initial render
  renderTable();
});


